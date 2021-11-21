# NeweggShuffle-Notification

Download dependencies used -> run: 
          
    npm i

In .env file, replace `your_api_key` with sendgrid api key.

    SENDGRID_API_KEY=your_api_key
    
    
***parse.js:***

Replace `example@gmail.com` with Newegg login email (line 27).

    await page.type("input#labeled-input-signEmail", "example@gmail.com")
     
     
Replace `example@gmail.com` with receiving email (line 142).
Replace `example@gmail.com` with verified sendgrid sender email (line 143).
    
    const email = {
    to: 'example@gmail.com',
    from: 'example@gmail.com',
    subject: subject,
    text: body,
    html: body
    }

Set time interval in minutes (line 152).

    const userNum = 20


***RUN:***

`node parse` to run.

Enter verification code when asked.

Do not click ***Sign In*** button after entering verification code.

Email will be sent every `userNum` minutes.