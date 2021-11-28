# NeweggShuffle-Notification

Download dependencies used -> run: 
          
    npm i
***.env:***
replace `your_api_key` with sendgrid api key.

    SENDGRID_API_KEY=your_api_key
 
replace `example1@gmail.com` with Newegg email, notification will be sent to this email.
    
    USER_EMAIL=example1@gmail.com
    
replace `example2@gmail.com` with verified sendgrid sender email.

    SENDGRID_SENDER_EMAIL=example2@gmail.com
    

***parse.js:***
Set time interval in minutes (line 152).

    const userNum = 20


***run:***

`node parse` to run.

Enter verification code when asked.

Do not click ***Sign In*** button after entering verification code.

Email will be sent every `userNum` minutes.
