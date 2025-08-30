const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '923681805@qq.com',
        pass: 'abcelsserpfibfie'
    }
});

// 发送验证码邮件
function sendVerifyCode(to, code) {
    const mailOptions = {
        from: '923681805@qq.com',
        to,
        subject: '【课程设计】登录密码找回验证码',
        html: `
      <div>
        <p>您好，您正在使用自习室预约系统的找回密码功能。</p>
        <p>您的验证码是：<b style="font-size:18px;">${code}</b>（5分钟内有效）</p>
        <p>如果不是您本人操作，请忽略此邮件。</p>
      </div>
    `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {sendVerifyCode};
