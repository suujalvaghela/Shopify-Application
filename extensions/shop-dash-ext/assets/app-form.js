let appForm = document.querySelector("[type=app-form]")

appForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    let fData = new FormData(appForm);
    let data = Object.fromEntries(fData.entries())
    await fetch(`${location.origin}/apps/proxy?shop=${Shopify.shop}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
})