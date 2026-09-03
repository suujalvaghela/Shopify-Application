import { Page, Layout } from "@shopify/polaris";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import OrderDetails from "../components/OrderDetails";
import { OrderGraphs } from "../components/OrderGraphs";

export default function HomePage() {

  const [productCount, setProductCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [fullfilledOrders, setFullfilledOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  async function fetchProductCount() {
    try {
      const request = await fetch('/api/products/count2');
      const response = await request.json();
      setProductCount(response?.count);
    }
    catch (error) {
      console.error('Error fetching product count:', error);
    }
  }

  async function fetchCollectionCount() {
    try {
      const request = await fetch('/api/collections/count2');
      const response = await request.json();
      setCollectionCount(response?.count);
    }
    catch (error) {
      console.error('Error fetching collection count:', error);
    }
  }

  async function fetchOrderData() {
    try {
      const request = await fetch('/api/orders/all');
      const response = await request.json();
      setOrderCount(response.data.length);
      const fulfilledOrdersCount = response.data?.filter(item => item.fulfillment_status === 'fulfilled');
      setFullfilledOrders(fulfilledOrdersCount.length);
      setPendingOrders(response.data.length - fulfilledOrdersCount.length);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  }

  useEffect(() => {
    fetchProductCount();
    fetchCollectionCount();
    fetchOrderData();
  }, [])

  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graph-section">
          <OrderGraphs />
        </div>
        <div className="card-section mt-3"></div>
        <Layout>
          <Card title='Total Orders' data={orderCount} OrderCard />
          <Card title='Fulfilled Orders' data={fullfilledOrders} FulfilledCard />
          <Card title='Pending Orders' data={pendingOrders} PendingCard />
          <Card title='Total Products' data={productCount} ProductCard />
          <Card title='Total Collections' data={collectionCount} CollectionCard />
        </Layout>
      </div>
      <div className="order-details-section mt-3">
        <OrderDetails />
      </div>
    </Page>
  );
}
