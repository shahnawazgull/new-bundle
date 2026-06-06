const WORKER_URL = "https://pain-relief.70126028.workers.dev/";

var currentVariantId = null;

function openCODForm(variantId) {
  currentVariantId = variantId;
  document.getElementById("cod-overlay").classList.add("active");
  document.getElementById("cod-form-wrap").style.display = "block";
  document.getElementById("cod-success").style.display = "none";
  document.getElementById("cod-error-msg").style.display = "none";
  document.body.style.overflow = "hidden";
  var btn = document.getElementById("cod-btn-submit");
  btn.disabled = false;
  btn.textContent = "Complete Order";
}

function closeCODForm() {
  document.getElementById("cod-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

async function submitCODForm() {
  var firstName = document.getElementById("cod-fname").value.trim();
  var lastName = document.getElementById("cod-lname").value.trim();
  var phone = document.getElementById("cod-phone").value.trim();
  var address = document.getElementById("cod-address").value.trim();
  var city = document.getElementById("cod-city").value.trim();
  var province = document.getElementById("cod-province").value;
  var errorEl = document.getElementById("cod-error-msg");

  if (!firstName || !phone || !address || !city || !province) {
    errorEl.textContent = "Please fill all required fields.";
    errorEl.style.display = "block";
    return;
  }

  var btn = document.getElementById("cod-btn-submit");
  btn.disabled = true;
  btn.textContent = "Placing Order...";
  errorEl.style.display = "none";

  try {
    var response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        city: city,
        province: province,
        variantId: currentVariantId,
        quantity: 1
      })
    });

    var result = await response.json();

    if (result.success) {
      document.getElementById("cod-form-wrap").style.display = "none";
      document.getElementById("cod-success").style.display = "block";
    } else {
      errorEl.textContent = "Something went wrong. Please try again.";
      errorEl.style.display = "block";
      btn.disabled = false;
      btn.textContent = "✅ Place Order (Cash on Delivery)";
    }
  } catch (err) {
    errorEl.textContent = "Connection error. Please try again.";
    errorEl.style.display = "block";
    btn.disabled = false;
    btn.textContent = "✅ Place Order (Cash on Delivery)";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var style = document.createElement("style");
  style.textContent = `
    #cod-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 99999;
      align-items: center;
      justify-content: center;
    }
      .cod-check {
  width: 60px;
  height: 60px;
  background: #e6f9ed; /* light green background */
  color: #22c55e; /* green tick */
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 10px auto;
}
    #cod-overlay.active { display: flex; }
    #cod-modal {
      background: #fff;
      border-radius: 12px;
      padding: 32px 28px;
      width: 100%;
      max-width: 480px;
      margin: 16px;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    #cod-modal h2 {
      margin: 0 0 6px;
      font-size: 20px;
      font-weight: 700;
      color: #111;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #cod-modal p.cod-subtitle {
      margin: 0 0 20px;
      font-size: 14px;
      color: #666;
    }
    #cod-modal .cod-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    #cod-modal .cod-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 14px;
    }
      input::placeholder,
textarea::placeholder {
  color: #707070;
  font-weight:normal;
}
    #cod-modal .cod-field label {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    #cod-modal .cod-field input {
      border: 1.5px solid #ddd;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      transition: border 0.2s;
    }
    #cod-modal .cod-field input:focus { border-color: #22c55e; }
    #cod-modal .cod-field select {
      border: 1.5px solid #ddd;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      transition: border 0.2s;
      background: #fff;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      cursor: pointer;
    }
      #cod-modal .cod-field select option[value=""] {
  color: #707070;
}
    #cod-modal .cod-field select:focus { border-color: #22c55e; }
    #cod-btn-submit {
      width: 100%;
      background: #22c55e;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 14px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 6px;
      transition: background 0.2s;
    }
    #cod-btn-submit:hover { background: #16a34a; }
    #cod-btn-submit:disabled { background: #aaa; cursor: not-allowed; }
    #cod-close {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #888;
      line-height: 1;
    }
    #cod-success {
      display: none;
      text-align: center;
      padding: 20px 0;
    }
    #cod-success .cod-check { font-size: 48px; }
    #cod-success h3 { font-size: 22px; font-weight: 700; margin: 12px 0 8px; }
    #cod-success p { color: #555; font-size: 15px; }
    #cod-error-msg {
      color: #dc2626;
      font-size: 13px;
      margin-top: 8px;
      display: none;
    }
    @media (max-width: 480px) {
      #cod-modal .cod-row { grid-template-columns: 1fr; gap: 0; }
    }
  `;
  document.head.appendChild(style);

  var overlay = document.createElement("div");
  overlay.id = "cod-overlay";
  overlay.innerHTML = `
    <div id="cod-modal">
      <button id="cod-close" onclick="closeCODForm()">✕</button>
      <div id="cod-form-wrap">
        <h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="rsi-icon" style="width: 32px; height: 27px;"><path fill="currentColor" d="M19.5 8H17V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2 0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c.55 0 1-.45 1-1v-3.33c0-.43-.14-.85-.4-1.2L20.3 8.4c-.19-.25-.49-.4-.8-.4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h2.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg> Cash on Delivery (COD)</h2>
        <p class="cod-subtitle">Fill your details to place your order</p>
        <div class="cod-row">
          <div class="cod-field">
            <label>First Name <span style="color: red;">*</span></label>
            <input type="text" id="cod-fname" placeholder="Ahmad" />
          </div>
          <div class="cod-field">
            <label>Last Name <span style="color: red;">*</span></label>
            <input type="text" id="cod-lname" placeholder="Khan" />
          </div>
        </div>
        <div class="cod-field">
          <label>Phone Number <span style="color: red;">*</span></label>
          <input type="tel" id="cod-phone" placeholder="03001234567" />
        </div>
        
        <div class="cod-row">
        <div class="cod-field">
            <label>Province <span style="color: red;">*</span></label>
            <select id="cod-province">
              <option value="">Select Province</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
              <option value="Azad Kashmir">Azad Kashmir</option>
            </select>
          </div>
          <div class="cod-field">
            <label>City <span style="color: red;">*</span></label>
            <input type="text" id="cod-city" placeholder="Lahore" />
          </div>
        </div>
        <div class="cod-field">
          <label>Address <span style="color: red;">*</span></label>
          <input type="text" id="cod-address" placeholder="House #, Street, Area" />
        </div>
        <button id="cod-btn-submit" onclick="submitCODForm()">Complete Order</button>
        <p id="cod-error-msg"></p>
      </div>
      <div id="cod-success">
  <div class="cod-check"><?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 117.72 117.72" style="enable-background:new 0 0 117.72 117.72" xml:space="preserve"><style type="text/css"><![CDATA[
	.st0{fill:#01A601;}
]]></style><g><path class="st0" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"/></g></svg></div>
  <h3>Order Placed Successfully!</h3>
  <p>Thank you for your order. Our team will contact you shortly to confirm the details.</p>
</div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeCODForm();
  });
});
