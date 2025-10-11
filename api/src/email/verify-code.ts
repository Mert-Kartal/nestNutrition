export const VERIFICATION_CODE_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; }
.container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.header { background-color: #f8f8f8; padding: 15px; text-align: center; border-bottom: 1px solid #eee; }
.content { padding: 20px 0; text-align: center; }
.code { font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0; padding: 10px; background-color: #e9ecef; border-radius: 4px; display: inline-block; }
.footer { font-size: 12px; color: #777; text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>E-posta Doğrulama</h2>
    </div>
    <div class="content">
      <p>Merhaba,</p>
      <p>Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
      <div class="code">{{VERIFICATION_CODE}}</div>
      <p>Bu kod {{EXPIRES_IN_MINUTES}} dakika içinde sona erecektir.</p>
      <p>Eğer bu e-postayı siz istemediyseniz, lütfen dikkate almayın.</p>
    </div>
    <div class="footer">
      <p>&copy; {{CURRENT_YEAR}} RedisIRLChat. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
`;
