export const WECOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(to bottom right, #34a853, #a3e635);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .header {
            text-align: center;
            padding: 20px;
            color: #ffffff;
        }
        .header h1 {
            font-size: 28px;
            margin: 10px 0;
        }
        .header p {
            font-size: 18px;
            margin: 5px 0;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
        }
        .feature {
            margin: 15px 0;
        }
        .feature-title {
            font-weight: bold;
            color: #34a853;
        }
        .cta-button {
            display: inline-block;
            margin: 20px auto;
            padding: 12px 24px;
            background-color: #34a853;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #2d8747;
        }
        .footer {
            background-color: #f1f3f6;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
        .footer a {
            color: #34a853;
            text-decoration: none;
        }
        .saira-condensed-semibold {
  font-family: "Saira Condensed", serif;
  font-weight: 600;
  font-style: normal;
}
.nunito {
  font-family: "Nunito", serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
.poppins-medium {
  font-family: "Poppins", serif;
  font-weight: 500;
  font-style: normal;
}

    </style>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Saira+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap');
        </style>
        
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 class="saira-condensed-semibold">Welcome to PIXELCODE</h1>
            <p class="nunito">Where Your Ideas Come to Life</p>
        </div>
        <div class="content nunito">
            <p>Hi {{name}},</p>
            <p>Thank you for joining PIXELCODE! We're here to make coding seamless, efficient, and enjoyable. Here's a glimpse of what awaits you:</p>
            Welcome to PIXELCODE, a flexible code editor for any programming language. Write, save, and manage your code with ease using its intuitive interface and powerful features.
            <p>Ready to take your coding experience to the next level? Click the button below to start exploring PIXELCODE today!</p>
            <a href="[YourWebsiteLink]" class="cta-button">Get Started Now</a>
        </div>
        <div class="footer">
            <p>Have questions? <a href="#">Contact Support</a></p>
            <p>&copy; 2024 PIXELCODE. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`


export const VERIFY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(to bottom right, #34a853, #a3e635);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .header {
            text-align: center;
            padding: 20px;
            color: #ffffff;
        }
        .header h1 {
            font-size: 28px;
            margin: 10px 0;
        }
        .header p {
            font-size: 18px;
            margin: 5px 0;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
        }
        .otp-box {
            border: 2px dashed #34a853;
            padding: 15px;
            margin: 20px auto;
            display: inline-block;
            font-size: 22px;
            font-weight: bold;
            color: #34a853;
            background-color: #f5f7fa;
            border-radius: 10px;
        }
        .cta-button {
            display: inline-block;
            margin: 20px auto;
            padding: 12px 24px;
            background-color: #34a853;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #2d8747;
        }
        .footer {
            background-color: #f1f3f6;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
        .footer a {
            color: #34a853;
            text-decoration: none;
        }
        .saira-condensed-semibold {
            font-family: "Saira Condensed", serif;
            font-weight: 600;
            font-style: normal;
        }
        .nunito {
            font-family: "Nunito", serif;
            font-weight: 500;
            font-style: normal;
        }
    </style>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;600;700&family=Nunito:wght@500&display=swap');
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 class="saira-condensed-semibold">Verify Your Email</h1>
            <p class="nunito">Secure Your PIXELCODE Account</p>
        </div>
        <div class="content nunito">
            <p>Hi {{name}},</p>
            <p>We are excited to have you on board! To complete your registration, please use the OTP below to verify your email address:</p>
            <div class="otp-box">
                {{otp}}
            </div>
            <p>If you did not create a PIXELCODE account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>Need assistance? <a href="#">Contact Support</a></p>
            <p>&copy; 2024 PIXELCODE. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`


export const RESET_PASSWORD_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(to bottom right, #34a853, #a3e635);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .header {
            text-align: center;
            padding: 20px;
            color: #ffffff;
        }
        .header h1 {
            font-size: 28px;
            margin: 10px 0;
        }
        .header p {
            font-size: 18px;
            margin: 5px 0;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
        }

        .cta-button {
            display: inline-block;
            margin: 20px auto;
            padding: 12px 24px;
            background: linear-gradient(to bottom right, #34a853, #2d8747);
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.2s;
        }
        .cta-button:hover {
            background: linear-gradient(to bottom right, #2d8747, #34a853);
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f1f3f6;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
        .footer a {
            color: #34a853;
            text-decoration: none;
        }
        .poppins-medium {
            font-family: "Poppins", serif;
            font-weight: 500;
            font-style: normal;
        }
        .otp-box {
    border: 2px dotted #34a853; /* Change solid to dotted */
    padding: 15px;
    margin: 20px auto;
    display: inline-block;
    font-size: 22px;
    font-weight: bold;
    color: #34a853;
    background-color: #f1f3f6;
    border-radius: 10px;
}

    </style>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 class="poppins-medium">Reset Your Password</h1>
            <p class="poppins-medium">Your PIXELCODE Account</p>
        </div>
        <div class="content poppins-medium">
            <p>Hi {{name}},</p>
            <p>It seems like you've requested to reset your password. Use the OTP below to proceed:</p>
            <div class="otp-box">
                {{otp}}
            </div>
            <p>If you did not request this change, please ignore this email or contact support.</p>
        </div>
        <div class="footer">
            <p>Need assistance? <a href="[SupportLink]">Contact Support</a></p>
            <p>&copy; 2024 PIXELCODE. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`