// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { connectDB } from "./mongoDb.js";
import { User } from "./userModel.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/userdata/*", authenticateUser);

connectDB();

async function authenticateUser(req, res, next) {
  const shop = req.query.shop
  const storeName = await shopify.config.sessionStorage.findSessionsByShop(shop)
  if (shop === storeName[0].shop) {
    next();
  } else {
    res.send("User Not Authorized")
  }
}

app.use(express.json());

app.post('/userdata/userinfo', async (req, res) => {
  try {
    const { userName, userEmail } = req.body
    if (!userName || !userEmail) {
      return res.json("Both fields are required!")
    }
    const user = await User.findOne({ userEmail })
    if (user) {
      return res.json("User with this mail already exist!")
    }
    const newUser = await User.create({ userName, userEmail })
    console.log("newUser:", newUser)
    res.status(200).json({ message: "User Created Successfully!", newUser })
  } catch (error) {
    console.log("Error:", error)
  }
})

app.get("/api/user/get", async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({ message: "User Fetched Successfully", users })
  } catch (error) {
    console.log("Error: ", error)
  }
})

app.get('/api/choco/product', async (req, res) => {
  try {
    const products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session
    })
    res.status(200).json({ message: "Products fetched successfully", products })
  } catch (error) {
    console.log("ERROR: ", error)
  }
})

app.put('/api/choco/product/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { title } = req.body
    const updatedProduct = new shopify.api.rest.Product({
      session: res.locals.shopify.session
    })
    updatedProduct.id = Number(id)
    updatedProduct.title = title
    await updatedProduct.save({ update: true })
    res.status(200).json({ message: "Product updated successfully", updatedProduct })
  } catch (error) {
    console.log("ERROR: ", error)
  }
})

app.post('/api/choco/product/', async (req, res) => {
  try {
    const { title } = req.body
    const newProduct = new shopify.api.rest.Product({
      session: res.locals.shopify.session
    })
    newProduct.title = title
    await newProduct.save({ update: true })
    res.status(200).json({ message: "Product Created Successfully", newProduct })
  } catch (error) {
    console.log("ERROR: ", error)
  }
})

app.delete('/api/choco/product/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await shopify.api.rest.Product.delete({
      session: res.locals.shopify.session,
      id
    })
    res.status(200).json({ message: "Product Deleted Successfully" })
  } catch (error) {
    console.log("ERROR: ", error)
  }
})









app.get("/api/store/info", async (req, res) => {
  try {
    const storeInfo = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    res.status(200).send(storeInfo);
  } catch (err) {
    console.error('Error fetching store info:', err);
  }
})

app.get("/api/products/count2", async (req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
  } catch (error) {
    console.error('Error fetching product count:', error);
  }
})

app.get("/api/collections/count2", async (req, res) => {
  try {
    const countData = await shopify.api.rest.CustomCollection.count({
      session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
  } catch (error) {
    console.error('Error fetching collection count:', error);
  }
})

app.get('/api/orders/all', async (req, res) => {
  try {
    const ordersData = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: 'any',
    })
    res.status(200).send(ordersData);
  } catch (error) {
    console.error('Error fetching all orders:', error);
  }
})

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Failed to process products/create: ${e.message}`);
      status = 500;
      error = e.message;
    } else {
      console.log(e);
      error = String(e);
    }
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
