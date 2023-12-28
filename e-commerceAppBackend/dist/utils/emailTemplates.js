"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderPlacedTemplate = exports.getChangePasswordTemplate = exports.resetPasswordTemplate = exports.getSignUpTemplate = void 0;
function getSignUpTemplate(userName) {
    return `<h1>Welcome ${userName}</h1>
            <div style=" background-color: #acacac;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
            margin: 20px auto;  max-width: 400px;">
              <h3 style="color: #0073e6;">Your Account is Created Successfully 🌹</h3>
              <p style="color: #333;">Your account has been successfully created. Welcome to our shopping application!</p>
            </div>
        `;
}
exports.getSignUpTemplate = getSignUpTemplate;
function resetPasswordTemplate(token) {
    return `<h1>Reset Your Password!</h1>
            <div style=" background-color: #ffffcc;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
            margin: 20px auto;  max-width: 400px;">
              <h3 style="color: #0073e6;">Click the below link to reset your password.</h3>
              <a style="color: #000;" href ="http://localhost:4200/auth/reset-password/${token}">Click here</a>

              <i style="color: red;">This link is valid for 10mins.</i>
            </div>
        `;
}
exports.resetPasswordTemplate = resetPasswordTemplate;
function getChangePasswordTemplate() {
    return `<div style=" background-color: #acacac;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
            margin: 20px auto;  max-width: 400px;">
              <h3 style="color: #0073e6;">Password Changed Successfully </h3>
              <p style="color: #333;">Your email password has been successfully changed. This step enhances the security of your account, safeguarding your personal information. Please ensure to remember your new password and avoid sharing it with anyone. If you encounter any issues or did not initiate this change, kindly contact our support team immediately. Thank you for choosing us for your email services!</p>
            </div>
        `;
}
exports.getChangePasswordTemplate = getChangePasswordTemplate;
function orderPlacedTemplate(orderId) {
    return `<h1>Your Order has been placed! 🤷‍♂️🐱‍🏍</h1>
            <div style=" background-color: #ffffcc;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
            margin: 20px auto;  max-width: 400px;">
              <h3 style="color: #0073e6;">Click the following link to get invoice.</h3>
              <a style="color: #000;" href ="http://localhost:8080/user/download-order-invoice/${orderId}">Click me here</a>
            </div>
        `;
}
exports.orderPlacedTemplate = orderPlacedTemplate;
