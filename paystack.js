document.getElementById("payBtn").addEventListener("click", function () {
  let handler = PaystackPop.setup({
    key: "pk_test_REPLACE_THIS",
    email: "customer@email.com",
    amount: 125000,
    currency: "ZAR",
    callback: function (response) {
      window.location.href = "success.html";
    },
    onClose: function () {
      alert("Payment cancelled");
    }
  });
  handler.openIframe();
});