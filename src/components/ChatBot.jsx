import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Fuel, CreditCard, Truck, Shield, HelpCircle, User, Settings, MapPin, Car, Phone, MessageCircle, Mail, AlertCircle } from 'lucide-react';
import './ChatBot.css';

const kb = [
  // ===== ACCOUNT & PROFILE =====
  { id:'a1', intents:['account','register'], tags:['create','account','register','sign','up','signup','join','new','open','start'], q:"How do I create an account?", a:'Click "Create Account" on the login page. Choose your role (Driver, Fleet Owner, Station Manager, etc.), fill in your details, and verify your email or phone with the 6-digit code sent to you.' },
  { id:'a2', intents:['account','register'], tags:['verify','confirm','email','phone','code','otp','6-digit','digit','activation'], q:"How do I verify my account?", a:'After registering, a 6-digit verification code is sent to your email or phone. Enter that code on the verification screen to activate your account.' },
  { id:'a3', intents:['account','login'], tags:['login','sign','in','log','access','enter','dashboard','signin'], q:"How do I log in?", a:'Enter your registered email and password on the login page. Once authenticated, you are taken to your role-specific dashboard.' },
  { id:'a4', intents:['account','login'], tags:['forgot','password','reset','lost','change','pw','forget','new password'], q:"I forgot my password, what do I do?", a:'Click "Forgot Password" on the login screen, enter your registered email address, and follow the password reset link sent to your inbox. You will be able to set a new password immediately.' },
  { id:'a5', intents:['account','login'], tags:['change','password','update','new','pass','pw','credentials','alter'], q:"How do I change my password?", a:'Go to your account settings and find the Change Password option. Enter your current password and the new one. Alternatively use "Forgot Password" from the login screen.' },
  { id:'a6', intents:['account','profile'], tags:['change','email','update','address','modify'], q:"How do I change my email address?", a:'Go to your account settings, locate the email field, enter your new email, and verify it with the confirmation code sent to your new address.' },
  { id:'a7', intents:['account','profile'], tags:['change','phone','number','update','mobile'], q:"How do I change my phone number?", a:'Go to your account settings, update the phone number field, and verify the new number with the 6-digit code sent via SMS.' },
  { id:'a8', intents:['account','profile'], tags:['update','photo','profile','picture','avatar','image'], q:"How do I update my profile photo?", a:'Go to your account settings, click on your current photo or avatar, upload a new image, and save the changes.' },
  { id:'a9', intents:['account','profile'], tags:['multiple','account','have','two','different','same','email'], q:"Can I have multiple accounts?", a:'No, each email address can only be associated with one VeloCity account. If you need multiple roles, contact support.' },
  { id:'a10', intents:['account','register'], tags:['not','verify','unverified','expire','time','happen'], q:"What happens if I don't verify my account?", a:'Your account remains inactive until verification is complete. You will not be able to log in or use any VeloCity features until you enter the 6-digit verification code.' },
  { id:'a11', intents:['account','profile','roles'], tags:['change','role','switch','different','after','registration','modify'], q:"Can I change my role after registration?", a:'Role changes are not available through self-service. Contact support and they can help evaluate if a role change is appropriate for your needs.' },
  { id:'a12', intents:['account','register'], tags:['how','long','take','verification','code','sms','email','time'], q:"How long does verification take?", a:'The verification code arrives within a few seconds via SMS or email. If you have not received it after 2 minutes, check your spam folder or request a new code.' },
  { id:'a13', intents:['account','register'], tags:['info','information','required','need','what','fields','mandatory'], q:"What information do I need to register?", a:'You need your full name, email address, phone number, and a password. If registering as a driver or fleet owner, you also need vehicle license plate and photo.' },
  { id:'a14', intents:['account','register'], tags:['register','without','no','phone','number','skip'], q:"Can I register without a phone number?", a:'No, a phone number is required for verification and security purposes. It ensures we can reach you and verify your identity at fueling stations.' },
  { id:'a15', intents:['account','profile','security'], tags:['personal','info','visible','others','public','see','who'], q:"Is my personal information visible to others?", a:'Only authorized station workers can see your verification photo during active fueling. Your personal data is never publicly visible.' },
  { id:'a16', intents:['account','delete','support'], tags:['delete','remove','close','account','cancel','deactivate','terminate'], q:"How do I delete my account?", a:'Account deletion requests should be directed to support. Contact us via WhatsApp, Telegram, or email and we will process your request within 48 hours.' },
  { id:'a17', intents:['account','security'], tags:['logout','sign','out','log','off','exit','switch user'], q:"How do I log out?", a:'Click on your profile icon or avatar in the top navigation bar, then select "Log Out" from the dropdown menu.' },
  { id:'a18', intents:['account','profile'], tags:['settings','where','find','account','preferences','config'], q:"Where do I find my account settings?", a:'Click on your profile avatar or icon in the top navbar and select "Settings" or "Account Settings" from the dropdown menu.' },
  { id:'a19', intents:['account','profile'], tags:['name','change','update','full','display'], q:"Can I change my display name?", a:'Yes, go to your account settings and edit your full name field. Save the changes and it will update across the system.' },
  { id:'a20', intents:['account','register'], tags:['resend','code','again','verification','otp','sms','email'], q:"Can I resend the verification code?", a:'Yes, on the verification screen click "Resend Code" to get a new 6-digit code sent to your email or phone.' },

  // ===== VEHICLE =====
  { id:'v1', intents:['vehicle','account'], tags:['vehicle','register','license','plate','photo','document','need','car','truck','motorcycle'], q:"What do I need to register a vehicle?", a:'You need your vehicle license plate number, a photo of the vehicle for verification, and your phone number. Optionally you can join a driver association.' },
  { id:'v2', intents:['vehicle','fleet'], tags:['multiple','many','vehicle','fleet','register','car','owner','add','second','another','more'], q:"Can I register multiple vehicles?", a:'Yes, fleet owners can register multiple vehicles. Each vehicle gets its own QR code, fuel wallet, and subscription. Manage them all from the Fleet Manager dashboard.' },
  { id:'v3', intents:['vehicle','general'], tags:['vehicle','info','detail','data','information','stored','where','location'], q:"Where is my vehicle info stored?", a:'Your vehicle information is stored in the static QR code printed for your vehicle, and also in the database linked to your account.' },
  { id:'v4', intents:['vehicle','account'], tags:['remove','delete','vehicle','unregister','take','off'], q:"Can I remove a vehicle from my account?", a:'Yes, go to your vehicle management section, select the vehicle you want to remove, and click "Remove Vehicle". Confirm the action to complete.' },
  { id:'v5', intents:['vehicle','account'], tags:['update','vehicle','info','change','modify','edit','details'], q:"How do I update vehicle information?", a:'Go to your vehicle list, select the vehicle, and click "Edit" to update its license plate, photo, or other details.' },
  { id:'v6', intents:['vehicle','fueling'], tags:['lose','lost','qr','code','sticker','replace','missing','damaged'], q:"What if I lose my vehicle QR code?", a:'Contact support or your station manager. A replacement static QR code can be generated and re-printed for your vehicle.' },
  { id:'v7', intents:['vehicle','general'], tags:['qr','code','last','long','expire','permanent','static'], q:"How long does the vehicle QR code last?", a:'The static QR code printed for your vehicle never expires. It is permanently linked to your vehicle record in the system.' },
  { id:'v8', intents:['vehicle','general'], tags:['print','own','qr','code','self','generate','pdf'], q:"Can I print my own QR code?", a:'Yes, you can generate and print the static QR code from your driver portal. Make sure it is printed clearly and attached visibly to your vehicle.' },
  { id:'v9', intents:['vehicle','account'], tags:['license','plate','change','new','updated','replace'], q:"What if my license plate changes?", a:'Update your vehicle details in the system with the new license plate number. A new QR code linked to the new plate will be generated.' },
  { id:'v10', intents:['vehicle','register'], tags:['motorcycle','bike','motorbike','register','two','wheeler'], q:"Can I register a motorcycle?", a:'Yes, motorcycles can be registered just like cars and trucks. The process is the same: license plate number and a photo of the motorcycle.' },
  { id:'v11', intents:['vehicle','account','fleet'], tags:['limit','vehicles','per','account','max','maximum','how','many'], q:"Is there a limit on vehicles per account?", a:'Drivers can register up to 2 vehicles. Fleet owners have a higher limit based on their subscription tier. Enterprise tier has unlimited vehicle registration.' },
  { id:'v12', intents:['vehicle','general'], tags:['rename','name','vehicle','nickname','label','custom'], q:"Can I give my vehicle a nickname?", a:'Yes, you can assign a custom name or nickname to each vehicle in your account for easy identification, like "Blue Truck" or "Company Car #1".' },
  { id:'v13', intents:['vehicle','account'], tags:['type','vehicle','kind','class','sedan','suv','truck','bus'], q:"Do I need to specify my vehicle type?", a:'Yes, during vehicle registration you can select the type (sedan, SUV, truck, bus, motorcycle) which helps stations prepare the right fuel type and amount.' },
  { id:'v14', intents:['vehicle','general'], tags:['vehicle','history','maintenance','service','log'], q:"Is there a vehicle maintenance log?", a:'VeloCity focuses on fuel management. Fuel consumption data can help you track when maintenance might be needed based on mileage and usage patterns.' },

  // ===== FUELING =====
  { id:'f1', intents:['fueling'], tags:['refuel','fuel','gas','fill','pump','station','how','process','dispense','get'], q:"How do I refuel at a station?", a:'Arrive at the station, show your static vehicle QR code or generate a refuel quota QR from your driver portal. The station worker scans it, verifies your identity, and dispenses the fuel. Payment is deducted automatically from your fuel wallet.' },
  { id:'f2', intents:['fueling','station'], tags:['find','station','near','available','fuel','search','look','locate','where','nearest'], q:"How do I find a station with fuel?", a:'Use the Refuel tab in your Driver Portal to view live station queues and estimated wait times. Stations show fuel availability: Full (plenty), Half (moderate), Low (limited), or None (out of fuel).' },
  { id:'f3', intents:['fueling'], tags:['fuel','type','kind','diesel','petrol','gasoline','grade','choose','select'], q:"What fuel types are available?", a:'Available fuel types vary by station. Common options include petrol (gasoline), diesel, and sometimes premium grades. Check the station details in the app for their specific offerings.' },
  { id:'f4', intents:['fueling'], tags:['how','much','choose','amount','select','liter','gallon','quantity'], q:"Can I choose how much fuel to pump?", a:'Yes, you can set a specific liter amount in your refuel request. The system dispenses exactly what you request, up to your daily limit and wallet balance.' },
  { id:'f5', intents:['fueling'], tags:['cancel','refuel','request','stop','abort'], q:"Can I cancel a fueling request?", a:'Yes, you can cancel a fueling request from your driver portal before the station worker begins dispensing. Once dispensing starts, it cannot be cancelled.' },
  { id:'f6', intents:['fueling'], tags:['receipt','after','refuel','get','print','digital','email'], q:"Do I get a receipt after fueling?", a:'Yes, a digital receipt is automatically generated and stored in your transaction history. You can view, download, or print it from the Fuel Wallet or Transactions section.' },
  { id:'f7', intents:['fueling','support'], tags:['wrong','amount','error','dispense','incorrect','overcharge','short'], q:"What if the worker dispenses the wrong amount?", a:'Report the discrepancy immediately through the Escalation Workflow in your account. The station manager will review and resolve the issue.' },
  { id:'f8', intents:['fueling','station'], tags:['emergency','urgent','need','fuel','emergency','breakdown','stranded'], q:"What if I need emergency fuel?", a:'Use the app to find the nearest station with available fuel. If you are stranded, contact support via WhatsApp or Telegram for assistance.' },
  { id:'f9', intents:['fueling','station'], tags:['station','runs','out','runs out','empty','while','queue','waiting'], q:"What happens if the station runs out while I am in queue?", a:'The system updates station status in real time. If a station runs out, your queue position is released and you can find the next nearest station with available fuel.' },
  { id:'f10', intents:['fueling','station'], tags:['rate','review','station','feedback','stars','rating','experience'], q:"Can I rate a station after fueling?", a:'Yes, after each fueling session you can rate the station and leave feedback. This helps maintain quality and helps other drivers choose stations.' },
  { id:'f11', intents:['fueling','payment'], tags:['check','balance','see','view','remaining','wallet','how','much','left'], q:"How do I check my wallet balance?", a:'Open your Driver Portal and look at the Fuel Wallet section. Your current balance is displayed prominently along with recent transactions.' },
  { id:'f12', intents:['fueling','station'], tags:['multiple','vehicles','at','once','same','time','fuel'], q:"Can I fuel multiple vehicles at once?", a:'Each vehicle must be refueled separately with its own QR code and refuel request. You can queue multiple vehicles but they are processed one at a time.' },
  { id:'f13', intents:['fueling','general'], tags:['know','how','much','fuel','received','got','dispensed'], q:"How do I know how much fuel I received?", a:'The station worker enters the amount before dispensing, and the final dispensed amount appears on your digital receipt and in your transaction history.' },
  { id:'f14', intents:['fueling'], tags:['prepay','prepay','advance','before','pre fund'], q:"Can I prepay for fuel?", a:'Yes, you pre-load funds into your fuel wallet in advance. The exact amount is deducted from your wallet when you refuel, so you always have funds ready.' },
  { id:'f15', intents:['fueling','station'], tags:['wait','fuel','take','long','average','time','session'], q:"How long does a fueling session take?", a:'A typical fueling session takes 5-10 minutes from QR scan to completion, depending on the amount of fuel and station efficiency.' },

  // ===== PAYMENT & WALLET =====
  { id:'p1', intents:['payment','wallet'], tags:['wallet','fund','add','money','balance','top','up','deposit','pay','load','credit'], q:"How do I add funds to my wallet?", a:'Go to the Fuel Wallet tab in your Driver Portal, click "Add Funds", enter the amount, and confirm. You can also transfer funds between vehicles you own.' },
  { id:'p2', intents:['payment','wallet'], tags:['wallet','empty','insufficient','no','money','out','run','balance','broke','zero','short'], q:"What if my wallet is empty at the station?", a:'Your wallet must have sufficient balance before fuel is dispensed. Top up remotely from the Driver Portal before arriving at the station to avoid delays.' },
  { id:'p3', intents:['payment','wallet'], tags:['pay','payment','method','how','cash','card','mobile','money','wallet','deduct','means'], q:"How do I pay for fuel?", a:'Payment is automatic from your fuel wallet. The station worker scans your QR, dispenses fuel, and the exact amount is deducted from your wallet balance. No cash or cards at the pump.' },
  { id:'p4', intents:['payment','wallet'], tags:['transaction','history','log','record','statement','receipt','view','past','see'], q:"How do I view my transaction history?", a:'Go to your Driver Portal and navigate to the Fuel Wallet or Transactions section to see your complete history with dates, amounts, station names, and transaction status.' },
  { id:'p5', intents:['payment'], tags:['price','cost','usd','etb','birr','dollar','rate','conversion','exchange','currency','convert'], q:"How does currency conversion work?", a:'Fuel prices are set in USD and converted to Ethiopian Birr (ETB) at the current exchange rate. You can see both prices displayed in the system.' },
  { id:'p6', intents:['payment','roles'], tags:['integrity','fee','percent','commission','distribution','split','3%','fee'], q:"What is the integrity fee?", a:'A 3% fee per transaction distributed as: municipality 1%, developer 1%, station worker 0.5%, and station admin 0.5%. This ensures transparency and incentivizes all parties.' },
  { id:'p7', intents:['payment','wallet'], tags:['minimum','balance','lowest','min','wallet'], q:"Is there a minimum wallet balance?", a:'There is no minimum balance requirement, but you must have sufficient funds to cover the fuel you want to purchase before the transaction is approved.' },
  { id:'p8', intents:['payment','wallet'], tags:['maximum','balance','limit','max','cap','wallet'], q:"Is there a maximum wallet balance?", a:'There is no upper limit on wallet balance. Enterprise subscription holders can maintain any amount in their wallet.' },
  { id:'p9', intents:['payment','wallet'], tags:['withdraw','money','cash','out','wallet','bank','transfer','refund'], q:"Can I withdraw money from my wallet?", a:'Wallet withdrawals are processed through the Escalation Workflow. Contact support to initiate a withdrawal. Refunds for incorrect transactions follow the same process.' },
  { id:'p10', intents:['payment','wallet'], tags:['invoice','tax','receipt','document','bill','vat','official'], q:"How do I get an invoice or tax receipt?", a:'Your transaction history includes detailed receipts suitable for record keeping. For official tax invoices, contact support with your transaction details.' },
  { id:'p11', intents:['payment','wallet'], tags:['fee','charge','cost','wallet','service','transaction','hidden'], q:"Are there any wallet or service fees?", a:'There are no fees for wallet deposits or transfers. The only fee is the 3% integrity fee applied per fueling transaction.' },
  { id:'p12', intents:['payment','wallet'], tags:['deposit','how','long','take','time','wallet','funds','add','processing'], q:"How long do wallet deposits take?", a:'Wallet deposits are processed instantly. Funds appear in your wallet immediately after you confirm the deposit.' },
  { id:'p13', intents:['payment','wallet'], tags:['low','balance','alert','notification','warning','reminder'], q:"Can I set a low balance alert?", a:'Yes, you can set a low balance threshold in your wallet settings. The system will notify you when your balance drops below that amount.' },
  { id:'p14', intents:['payment','wallet'], tags:['spending','month','view','by','monthly','summary','period'], q:"Can I view my spending by month?", a:'Yes, the wallet section includes monthly spending summaries with filters by date range, station, and vehicle to help you track expenses.' },
  { id:'p15', intents:['payment','wallet','security'], tags:['payment','info','secure','safe','card','details','saved'], q:"Is my payment information secure?", a:'Yes, all payment data is encrypted and processed through secure channels. Wallet transactions are logged and monitored for suspicious activity.' },
  { id:'p16', intents:['payment','wallet'], tags:['link','bank','account','connect','direct','transfer'], q:"Can I link a bank account?", a:'Direct bank account linking is not currently available. Wallet deposits are processed through available payment channels in the app.' },
  { id:'p17', intents:['payment','wallet'], tags:['refund','return','cancel','reversal','undo','money','back','incorrect'], q:"Can I get a refund?", a:'Refund requests for incorrect transactions can be submitted through the Escalation Workflow. Station managers and municipality admins review and process refunds.' },
  { id:'p18', intents:['payment','wallet'], tags:['transfer','move','send','between','vehicle','wallet','fund'], q:"Can I transfer funds between vehicles?", a:'Yes, you can transfer wallet funds between vehicles you own. Go to the Fuel Wallet tab and select "Transfer Between Vehicles".' },

  // ===== SUBSCRIPTION =====
  { id:'s1', intents:['subscription','payment'], tags:['subscription','plan','tier','package','pricing','basic','premium','enterprise','cost','monthly','price'], q:"What subscription plans are available?", a:'Basic (1,000 ETB/mo, 50L/day), Premium (2,500 ETB/mo, 150L/day), and Enterprise (5,000 ETB/mo, unlimited fueling). Higher tiers include priority queue access.' },
  { id:'s2', intents:['subscription'], tags:['upgrade','downgrade','change','plan','switch','promote','demote','move'], q:"How do I change my subscription?", a:'Go to the Refuel tab in your Driver Portal, find your vehicle in the Subscription section, and click on the tier you want. The change takes effect immediately.' },
  { id:'s3', intents:['subscription'], tags:['limit','exceed','daily','over','blocked','cap','stop','restrict','reached'], q:"What if I exceed my daily fuel limit?", a:'The system blocks the transaction if it exceeds your tier daily limit. Upgrade your plan to unlock higher limits at any time from your dashboard.' },
  { id:'s4', intents:['subscription'], tags:['daily','limit','day','per','liter','allocation','quota','cap'], q:"What is my daily fuel limit?", a:'Basic plan allows 50L per day. Premium allows 150L per day. Enterprise has unlimited daily fueling. Limits reset at midnight.' },
  { id:'s5', intents:['subscription'], tags:['different','plan','per','vehicle','multiple','separate'], q:"Can I have different plans for different vehicles?", a:'Yes, each vehicle can have its own subscription plan. A fleet owner might have Basic on one vehicle and Enterprise on another.' },
  { id:'s6', intents:['subscription'], tags:['expire','expiration','subscription','end','renew','lapse'], q:"What happens when my subscription expires?", a:'When your subscription expires, your daily fuel limit drops to zero until you renew. You can renew or upgrade at any time from your dashboard.' },
  { id:'s7', intents:['subscription','payment'], tags:['refund','subscription','unused','cancel','money','back'], q:"Can I get a refund for unused subscription days?", a:'Subscription refunds for unused days are handled on a case-by-case basis. Contact support to discuss your situation.' },
  { id:'s8', intents:['subscription','general'], tags:['free','trial','try','test','sample','before'], q:"Is there a free trial?", a:'There is no free trial for subscriptions. However, the demo mode lets you explore all features with test accounts and demo data.' },
  { id:'s9', intents:['subscription'], tags:['pause','hold','suspend','freeze','subscription','temporary'], q:"Can I pause my subscription?", a:'Subscriptions cannot be paused. You can downgrade to Basic to reduce costs, or cancel and resubscribe later.' },
  { id:'s10', intents:['subscription','payment'], tags:['annual','yearly','discount','save','bulk'], q:"Are there annual discounts?", a:'Annual billing options are not currently available. Subscriptions are billed monthly. Contact support for enterprise pricing discussions.' },
  { id:'s11', intents:['subscription','payment'], tags:['payment','method','subscription','how','pay','for'], q:"How do I pay for my subscription?", a:'Subscription fees are deducted from your fuel wallet automatically each month. Ensure your wallet has sufficient balance before the renewal date.' },
  { id:'s12', intents:['subscription'], tags:['priority','queue','access','fast','skip','line','premium'], q:"What is priority queue access?", a:'Premium and Enterprise subscribers get priority placement in station queues, meaning shorter wait times compared to Basic plan holders.' },

  // ===== FLEET =====
  { id:'fl1', intents:['fleet'], tags:['fleet','manager','owner','driver','manage','oversee','monitor','track','control'], q:"How do fleet owners manage drivers?", a:'Fleet owners can view all vehicles, monitor fuel consumption per vehicle, set individual fuel limits, and track spending across the entire fleet from the Fleet Manager dashboard.' },
  { id:'fl2', intents:['fleet','general'], tags:['analytics','report','statistic','data','insight','fleet','consumption','spend'], q:"Where can I see fleet analytics?", a:'The fleet dashboard shows fuel consumption per vehicle, total spending, individual driver usage, and cost trends over time to optimize fleet fuel management.' },
  { id:'fl3', intents:['fleet','account'], tags:['add','driver','fleet','new','employee','assign'], q:"How do I add a driver to my fleet?", a:'Go to Fleet Manager, click "Add Driver", enter their details or select from registered users, and assign them to a vehicle in your fleet.' },
  { id:'fl4', intents:['fleet','account'], tags:['remove','driver','fleet','delete','terminate','fire'], q:"How do I remove a driver from my fleet?", a:'Go to Fleet Manager, select the driver, and click "Remove". The vehicle will be unlinked from that driver.' },
  { id:'fl5', intents:['fleet','payment'], tags:['driver','own','wallet','personal','separate'], q:"Can drivers have their own wallets?", a:'Yes, each driver has their own fuel wallet. As a fleet owner, you can transfer funds to driver wallets or set individual spending limits.' },
  { id:'fl6', intents:['fleet','payment'], tags:['set','limit','spending','per','vehicle','driver','cap','budget'], q:"Can I set per-vehicle spending limits?", a:'Yes, fleet owners can set daily or monthly fuel spending limits for each individual vehicle or driver in their fleet.' },
  { id:'fl7', intents:['fleet','general'], tags:['export','fleet','data','csv','excel','download','report'], q:"Can I export fleet data?", a:'Yes, the Fleet Manager dashboard includes an export option to download fleet data as CSV or Excel files for external analysis.' },
  { id:'fl8', intents:['fleet','general'], tags:['fuel','efficiency','consumption','mpg','km','liter','track','vehicle'], q:"Can I track fuel efficiency per vehicle?", a:'Yes, the system tracks liters consumed per vehicle over time, which helps you calculate fuel efficiency and identify maintenance needs.' },
  { id:'fl9', intents:['fleet','support'], tags:['driver','dispute','issue','problem','fleet','resolve'], q:"How do I handle driver disputes?", a:'Use the Escalation Workflow to report and resolve disputes. Fleet owners and station managers can review transaction logs to settle disagreements.' },
  { id:'fl10', intents:['fleet','general'], tags:['monitor','real','time','live','fleet','tracking','activity'], q:"Can I monitor fleet activity in real time?", a:'The Fleet Manager dashboard shows live data on current fueling sessions, queue positions, and recent transactions across your entire fleet.' },
  { id:'fl11', intents:['fleet','general'], tags:['fleet','summary','overview','dashboard','see','at','glance'], q:"What does the fleet dashboard show?", a:'The fleet dashboard provides a summary of total fleet consumption, active drivers, pending transactions, monthly spending, and per-vehicle breakdowns.' },
  { id:'fl12', intents:['fleet','account'], tags:['transfer','vehicle','between','fleet','owner','move'], q:"Can I transfer a vehicle to another fleet owner?", a:'Vehicle transfers between fleet owners are not available as a self-service feature. Contact support to facilitate the transfer.' },

  // ===== STATION =====
  { id:'st1', intents:['station'], tags:['station','status','fuel','level','full','half','low','none','availability','indicator'], q:"What do station fuel statuses mean?", a:'Full means plenty of fuel available. Half means moderate supply. Low means limited fuel remaining. None means the station is out of fuel.' },
  { id:'st2', intents:['station'], tags:['time','hour','open','closed','when','schedule','station','operating'], q:"When are stations open?", a:'Appointments start at 6:00 AM with 10-minute windows in batches of 5. Station operating hours vary by location. Check individual station details for specific schedules.' },
  { id:'st3', intents:['station','fueling'], tags:['booking','book','reserve','slot','appointment','station','schedule'], q:"How do I book a station appointment?", a:'From the Refuel tab select a station, choose an available time slot, and confirm your booking. Appointments run in 10-minute windows starting at 6:00 AM.' },
  { id:'st4', intents:['station','fueling'], tags:['queue','wait','line','time','position','estimated','how','long','ahead'], q:"How does the queue system work?", a:'When you request refueling, you are added to the station queue. The system estimates your wait time based on vehicles ahead. Your position updates in real time.' },
  { id:'st5', intents:['station','roles'], tags:['become','station','manager','how','apply','job'], q:"How do I become a station manager?", a:'Station manager positions are assigned by municipality admins. Contact your local municipality admin or check the roles section for opportunities.' },
  { id:'st6', intents:['station','roles'], tags:['register','new','station','add','open','create','establish'], q:"How do I register a new station?", a:'Station registration is handled by municipality admins. Contact your municipality admin with the station details and they will process the registration.' },
  { id:'st7', intents:['station','general'], tags:['rate','review','station','stars','feedback','score'], q:"Can I rate a station?", a:'Yes, after each fueling session you can rate the station with stars and leave a comment. Ratings help maintain service quality across all stations.' },
  { id:'st8', intents:['station','support'], tags:['station','slow','slow','inefficient','delay','wait','complaint'], q:"What if a station is consistently slow?", a:'Report the issue through the Escalation Workflow. Municipality admins monitor station performance and can take corrective action.' },
  { id:'st9', intents:['station','support'], tags:['report','station','issue','problem','complaint','bad','service'], q:"How to report a station issue?", a:'Use the Escalation Workflow in your account. Select the station, describe the issue, and submit. Municipality and developer admins will review it.' },
  { id:'st10', intents:['station','payment'], tags:['station','price','own','set','different','vary'], q:"Can stations set their own prices?", a:'Fuel prices are set system-wide in USD with ETB conversion. Individual stations do not set their own prices.' },
  { id:'st11', intents:['station','roles'], tags:['station','inventory','fuel','stock','manage','track','levels'], q:"How does station fuel inventory work?", a:'Station managers track their fuel inventory levels in the system. When fuel is dispensed, inventory is automatically reduced. Managers can request resupply when low.' },
  { id:'st12', intents:['station','fueling'], tags:['station','full','capacity','queue','max','maximum','vehicles'], q:"What if a station is at full capacity?", a:'If a station queue is full, the system will suggest the next nearest station with available capacity to save you time.' },
  { id:'st13', intents:['station','fueling'], tags:['miss','appointment','late','no','show','penalty'], q:"What happens if I miss my appointment?", a:'Missed appointments release your slot to the next person in line. Frequent missed appointments may affect your scheduling privileges.' },
  { id:'st14', intents:['station','fueling'], tags:['leave','exit','queue','remove','cancel','position'], q:"Can I leave the queue?", a:'Yes, you can remove yourself from the queue at any time from your driver portal. Your spot is released immediately.' },
  { id:'st15', intents:['station','fueling'], tags:['see','how','many','people','ahead','queue','position','number'], q:"Can I see how many people are ahead of me?", a:'Yes, the queue screen shows your current position number and the estimated wait time based on the number of vehicles ahead of you.' },

  // ===== SECURITY =====
  { id:'se1', intents:['security'], tags:['secure','protect','safe','security','privacy','account','protected','safeguard'], q:"How is my account protected?", a:'Accounts are protected by password authentication. Suspicious activity like rapid refills or unusual patterns is detected automatically and flagged for review.' },
  { id:'se2', intents:['security'], tags:['theft','stolen','fraud','suspicious','flag','report','steal','unauthorized','stolen fuel'], q:"What should I do if I suspect fuel theft?", a:'Report it immediately via the "Report Issue" button in the Escalation Workflow. Station managers and municipality admins will review and take action.' },
  { id:'se3', intents:['security','account'], tags:['two','factor','2fa','auth','authenticator','otp','two-factor','mfa','multi'], q:"Is two-factor authentication available?", a:'Email and phone verification is done during registration with a 6-digit code. For additional security, unusual activities trigger automatic verification checks.' },
  { id:'se4', intents:['security','account'], tags:['blocked','suspend','ban','lock','disabled','locked','suspended','frozen'], q:"My account was blocked, why?", a:'Accounts can be blocked due to suspicious activity detected by the system. Contact support or use the Escalation Workflow to resolve it with an administrator.' },
  { id:'se5', intents:['security','support'], tags:['report','problem','worker','station','employee','misconduct'], q:"How to report a problem with a station worker?", a:'Use the Escalation Workflow in your account. Select the station and worker involved (if known), describe the incident, and submit the report.' },
  { id:'se6', intents:['security'], tags:['suspicious','activity','considered','triggers','flag','detect'], q:"What is considered suspicious activity?", a:'Rapid repeat refueling, unusual fueling patterns outside your normal behavior, multiple failed verification attempts, and abnormal location activity are flagged.' },
  { id:'se7', intents:['security'], tags:['report','investigated','how','process','review','look','into'], q:"How are reports investigated?", a:'Reports are reviewed by station managers first, then escalated to municipality admins if needed. Each report is logged and tracked until resolution.' },
  { id:'se8', intents:['security'], tags:['report','anonymous','anonymous','identity','hidden'], q:"Can I report anonymously?", a:'Yes, you can submit anonymous reports through the Escalation Workflow. Your identity is not disclosed to the station or worker involved.' },
  { id:'se9', intents:['security'], tags:['report','after','what','happens','next','follow','up'], q:"What happens after I report an issue?", a:'The report is assigned to the relevant admin for review. You will receive notifications as the report status updates: received, under review, resolved, or escalated.' },
  { id:'se10', intents:['security','support'], tags:['dispute','resolve','resolution','process','how','settled'], q:"How are disputes resolved?", a:'Disputes follow the Escalation Workflow: station manager reviews the evidence, municipality admin can mediate if needed, and a final decision is issued with notification to all parties.' },
  { id:'se11', intents:['security','account'], tags:['activity','log','audit','trail','view','actions','history','security'], q:"Can I view my account activity log?", a:'Yes, your account settings include an activity log showing login times, transaction history, and account changes for security monitoring.' },
  { id:'se12', intents:['security','account'], tags:['unauthorized','access','someone','else','hacked','compromised'], q:"What if someone accesses my account?", a:'Immediately change your password and contact support. The system will flag any unusual activity and can temporarily freeze your account for investigation.' },
  { id:'se13', intents:['security','vehicle'], tags:['qr','code','misuse','someone','else','use','my','fake'], q:"What if someone misuses my vehicle QR code?", a:'Report it immediately. The system logs every QR scan and can trace misuse. Your QR code is linked to your verified photo, making impersonation difficult.' },

  // ===== ROLES =====
  { id:'r1', intents:['roles'], tags:['role','choose','pick','select','type','which','driver','fleet','owner','station','manager','worker','municipality','admin'], q:"What roles can I choose from?", a:'During registration you pick: Driver, Fleet Owner, Station Manager, Station Worker, Municipality Admin, or Developer Admin. Your role determines system access.' },
  { id:'r2', intents:['roles'], tags:['driver','role','what','does','do','permission','capabilities'], q:"What can a Driver do?", a:'Drivers can register vehicles, generate refuel QR codes, manage their fuel wallet, view transaction history, book appointments, and track station queues.' },
  { id:'r3', intents:['roles','fleet'], tags:['fleet','owner','role','what','does','do','permission','manage'], q:"What can a Fleet Owner do?", a:'Fleet owners have all Driver capabilities plus: register multiple vehicles, monitor fuel consumption per vehicle, set driver limits, and track fleet-wide spending.' },
  { id:'r4', intents:['roles'], tags:['worker','station','employee','role','what','does','do','job','duties'], q:"What does a Station Worker do?", a:'Station workers scan vehicle QR codes, verify driver identity against registered photos, dispense fuel, and record transactions. They earn 0.5% integrity fee per transaction.' },
  { id:'r5', intents:['roles'], tags:['manager','station','oversee','supervisor','admin','role','what'], q:"What does a Station Manager do?", a:'Station managers oversee operations, manage fuel inventory, handle escalation workflows, approve reports, and manage station worker accounts.' },
  { id:'r6', intents:['roles'], tags:['municipality','admin','city','government','regulate','role','what'], q:"What does a Municipality Admin do?", a:'Municipality admins approve new station registrations, monitor regional fuel distribution, review escalation reports, and oversee compliance. They earn 1% integrity fee.' },
  { id:'r7', intents:['roles'], tags:['developer','super','admin','owner','system','superadmin','role','what'], q:"What does a Developer Admin do?", a:'Developer admins have full system access: manage all users, stations, transactions, settings, and receive the 1% developer integrity fee.' },
  { id:'r8', intents:['roles','account'], tags:['multiple','roles','have','more','one','combine'], q:"Can I have multiple roles?", a:'Each account is assigned one role during registration. If you need different role access, you would need a separate account with a different email.' },
  { id:'r9', intents:['roles','station'], tags:['promote','worker','manager','upgrade','role','change','how'], q:"How to promote a worker to manager?", a:'Role promotions are handled by municipality or developer admins. Contact your supervising admin to request a role change for a station worker.' },
  { id:'r10', intents:['roles','general'], tags:['permission','each','role','what','access','see','do','matrix'], q:"What permissions does each role have?", a:'Drivers: fueling & wallet. Fleet Owners: fleet management. Workers: scan & dispense. Managers: station oversight. Municipality: regional oversight. Developer: full system access.' },

  // ===== GENERAL =====
  { id:'g1', intents:['general'], tags:['what','is','velocity','velo','city','system','about','platform','explain'], q:"What is VeloCity?", a:'VeloCity is a fuel access ecosystem for Ethiopia. It connects drivers, fleet owners, fuel stations, municipalities, and administrators in one platform with QR-based vehicle ID, digital wallets, real-time queues, subscriptions, and theft detection.' },
  { id:'g2', intents:['general'], tags:['benefit','advantage','why','use','good','better','point','purpose'], q:"Why should I use VeloCity?", a:'VeloCity eliminates fuel fraud, reduces wait times with real-time queue tracking, provides transparent pricing, enables cashless payments, and gives fleet owners full consumption visibility.' },
  { id:'g3', intents:['general'], tags:['demo','test','sample','example','try','trial','mode','explore','sandbox'], q:"Is there a demo mode?", a:'Yes, the frontend works in demo mode without a backend. It uses in-memory demo data with pre-configured test accounts. Login with developer/dev123 or municipality/muni123.' },
  { id:'g4', intents:['general'], tags:['language','english','amharic','oromo','translate','local','switch','change'], q:"What languages are supported?", a:'VeloCity supports three languages: English, Amharic, and Afaan Oromo. Switch languages from the settings menu in the navbar at any time.' },
  { id:'g5', intents:['general'], tags:['offline','mode','internet','connection','network','without','no internet','disconnected'], q:"Does the app work offline?", a:'Yes, VeloCity has offline-first mode. Core features work without internet and sync automatically when you are back online.' },
  { id:'g6', intents:['general'], tags:['mobile','app','phone','android','ios','cross','platform','native'], q:"Is there a mobile app?", a:'Yes, VeloCity has a mobile app built with React Native and Expo. There is also a Telegram Mini App and Telegram Bot for quick access without the full web app.' },
  { id:'g7', intents:['general'], tags:['telegram','bot','mini','app','messaging','chat','quick'], q:"Can I use VeloCity on Telegram?", a:'Yes! There is a Telegram Bot and Telegram Mini App for quick access to VeloCity features without opening the full web application.' },
  { id:'g8', intents:['general'], tags:['browser','chrome','firefox','edge','safari','compatible','support','which'], q:"Which browsers are supported?", a:'VeloCity works on all modern browsers: Chrome, Firefox, Safari, and Edge. The app runs on port 8080 in development mode.' },
  { id:'g9', intents:['general'], tags:['theme','dark','light','mode','color','appearance','switch','toggle','night'], q:"Can I change the theme?", a:'Yes, VeloCity supports both dark and light themes. Toggle between them from the settings menu or using the theme switch button in the navbar.' },
  { id:'g10', intents:['general'], tags:['keyboard','shortcut','command','palette','quick','ctrl','k','cmd','hotkey'], q:"Are there keyboard shortcuts?", a:'Yes, press Ctrl+K (or Cmd+K on Mac) to open the Command Palette for quick access to features and navigation.' },
  { id:'g11', intents:['general'], tags:['notification','alert','notify','bell','badge','unread','update','bell icon'], q:"How do notifications work?", a:'You receive notifications for station registration approvals, fuel level alerts, settlement reports, unusual activity flags, and appointment reminders. Red badge shows unread count.' },
  { id:'g12', intents:['general'], tags:['update','version','new','feature','change','release','latest','whats new'], q:"What is new in the latest update?", a:'VeloCity continuously improves. Check the footer in the Help panel for the current version. New features are announced through the notification system.' },
  { id:'g13', intents:['general','support'], tags:['tutorial','guide','learn','how','walkthrough','help','getting','started'], q:"Where can I learn how to use the system?", a:'The Help panel (green button) has a comprehensive FAQ section with search. You can also ask me anything here about VeloCity.' },
  { id:'g14', intents:['general'], tags:['api','developer','integration','documentation','docs','technical','dev'], q:"Is there an API for developers?", a:'Yes, VeloCity has a REST API built with FastAPI. API documentation is available through the backend service at /docs endpoint when running locally.' },
  { id:'g15', intents:['general'], tags:['open','source','github','code','repository','contribute','public'], q:"Is VeloCity open source?", a:'The frontend and backend source code is available. Contact the development team for access to the repository and contribution guidelines.' },
  { id:'g16', intents:['general'], tags:['tech','technology','stack','built','with','react','fastapi','python','javascript','framework'], q:"What technology does VeloCity use?", a:'Frontend: React + Vite. Backend: FastAPI (Python). Database: Supabase/PostgreSQL and JSON. Mobile: React Native + Expo. Telegram: python-telegram-bot.' },
  { id:'g17', intents:['general'], tags:['data','backup','stored','secure','database','json','supabase'], q:"How is data backed up?", a:'Production data is backed up through Supabase automated backups. The development environment uses a JSON file that auto-initializes on first run.' },
  { id:'g18', intents:['general'], tags:['available','where','region','country','ethiopia','outside','expand'], q:"Where is VeloCity available?", a:'VeloCity is currently operating in Ethiopia with plans to expand to other regions. Check the announcements for expansion updates.' },
  { id:'g19', intents:['general','support'], tags:['bug','report','report bug','issue','technical','problem','error','glitch'], q:"How do I report a bug?", a:'Report bugs through the Escalation Workflow or contact support via WhatsApp or Telegram. Include screenshots and steps to reproduce for faster resolution.' },
  { id:'g20', intents:['general','support'], tags:['feature','suggest','request','idea','improvement','propose'], q:"How do I suggest a feature?", a:'Feature suggestions are welcome. Contact support via WhatsApp or Telegram with your idea and we will forward it to the development team.' },
  { id:'g21', intents:['general'], tags:['partner','partnership','collaborate','business','corporate'], q:"Can I become a partner?", a:'Partnership inquiries should be directed to the business development team via email at support@velocity.com with details about your organization.' },
  { id:'g22', intents:['general'], tags:['referral','refer','invite','friend','bonus','reward'], q:"Is there a referral program?", a:'Referral program details are announced periodically. Check your notifications and announcements for any active referral campaigns.' },
  { id:'g23', intents:['general'], tags:['dashboard','portal','home','main','screen','interface','ui'], q:"What is the dashboard?", a:'Your dashboard is the main screen after login. It shows key metrics, recent transactions, notifications, and quick actions tailored to your role.' },
  { id:'g24', intents:['general','register'], tags:['demo','account','test','login','demo login','try','demo user'], q:"What demo accounts are available?", a:'Demo accounts: developer/dev123 (super admin), municipality/muni123, stationmgr/station123, stationworker/worker123, fleet1/fleet123, driver1/driver123.' },
  { id:'g25', intents:['general'], tags:['earnings','money','income','driver','worker','earn','how','much','commission','integrity'], q:"How do station workers earn money?", a:'Station workers earn 0.5% integrity fee per transaction. Station admins earn 0.5%. Municipality admins earn 1%. Developer admin earns 1% of each transaction.' },
  { id:'g26', intents:['general'], tags:['privacy','data','collect','share','personal','info','private','policy'], q:"How is my privacy protected?", a:'Your personal data and vehicle information are stored securely. Only authorized station workers can access your verification photo during fueling. Read our Privacy Policy for details.' },
  { id:'g27', intents:['general'], tags:['compliance','regulation','law','government','standard','require','legal'], q:"Is VeloCity compliant with regulations?", a:'VeloCity operates in compliance with applicable Ethiopian regulations. The system is designed to meet local fuel distribution and financial transaction standards.' },
  { id:'g28', intents:['general'], tags:['version','vite','version','app','build','number','current'], q:"What version is the app?", a:'The current version is shown in the footer of the Help panel. The app is built with Vite and the version is configured in the environment.' },
  { id:'g29', intents:['general','station'], tags:['fuel','status','color','meaning','green','yellow','red','indicator'], q:"What do the fuel status colors mean?", a:'Green (Full) = plenty of fuel. Yellow (Half) = moderate supply. Orange (Low) = limited fuel remaining. Red (None) = out of fuel.' },
  { id:'g30', intents:['general'], tags:['association','driver','group','join','member','club','benefit'], q:"What is a driver association?", a:'An optional group you can join during vehicle registration. Being part of an association provides additional benefits and support within VeloCity.' },
  { id:'g31', intents:['general'], tags:['demo','account','test','login','demo login','try','demo user'], q:"How do I access demo mode?", a:'Simply log in with any demo account developer/dev123, municipality/muni123, stationmgr/station123, stationworker/worker123, fleet1/fleet123, or driver1/driver123.' },

  // ===== SUPPORT =====
  { id:'su1', intents:['support'], tags:['contact','support','help','technical','issue','problem','reach','talk','human','agent'], q:"Who do I contact for issues?", a:'Use WhatsApp at +251 911 234 567 or Telegram at t.me/velocityfuel for fast support. You can also call +251 911 234 567 or email support@velocity.com.' },
  { id:'su2', intents:['support'], tags:['system','down','crash','error','bug','issue','technical','problem','broken','not working'], q:"The system is not working, what do I do?", a:'First check your internet connection. VeloCity has offline mode for basic functions. If the problem persists, contact support via WhatsApp or Telegram.' },
  { id:'su3', intents:['support'], tags:['slow','lag','performance','speed','loading','hang','freeze','stuck'], q:"The app is slow, why?", a:'Performance can be affected by your internet speed. Try refreshing the page. VeloCity has offline-first mode for basic functions. Report persistent issues to support.' },
  { id:'su4', intents:['support'], tags:['support','hours','time','available','when','reachable','24/7'], q:"What are the support hours?", a:'Support is available 24/7 via WhatsApp and Telegram. Email responses may take up to 24 hours during business days.' },
  { id:'su5', intents:['support','general'], tags:['support','local','language','amharic','oromo','english','native'], q:"Is support available in local languages?", a:'Yes, support can be provided in English, Amharic, and Afaan Oromo. Just specify your preferred language when contacting us.' },
  { id:'su6', intents:['support'], tags:['training','session','workshop','learn','onboarding','tutorial','guide'], q:"Can I book a training session?", a:'Training sessions are available for fleet owners and station staff. Contact support to schedule a session appropriate for your role.' },
  { id:'su7', intents:['support'], tags:['manual','user','guide','pdf','documentation','book'], q:"Is there a user manual?", a:'The Help panel (green ? button) serves as your user manual with comprehensive FAQ. You can also ask me here for instant guidance on any feature.' },
  { id:'su8', intents:['support'], tags:['video','tutorial','watch','learn','visual','demo','walkthrough'], q:"Are there video tutorials?", a:'Video tutorials are available on the VeloCity platform. Check the Help panel or contact support for links to tutorial videos.' },
  { id:'su9', intents:['support'], tags:['escalate','issue','complaint','unresolved','higher','authority','not satisfied'], q:"How do I escalate an issue?", a:'If you are not satisfied with the initial response, the Escalation Workflow automatically routes your issue to the next level of administration for review.' },
  { id:'su10', intents:['support'], tags:['info','provide','when','reporting','issue','details','need','include'], q:"What information should I include when reporting?", a:'Include your account email, vehicle plate number (if applicable), station name, date and time, description of the issue, and any relevant screenshots.' },
  { id:'su11', intents:['support'], tags:['phone','support','call','speak','talk','person'], q:"Can I get phone support?", a:'Yes, you can call us at +251 911 234 567 during business hours for direct phone support.' },
  { id:'su12', intents:['support'], tags:['whatsapp','link','join','channel','group','connect'], q:"How do I reach support on WhatsApp?", a:'Click the WhatsApp button in the Help panel Contact tab or send a message to +251 911 234 567 on WhatsApp for the fastest response.' },
  { id:'su13', intents:['support'], tags:['telegram','link','join','channel','group','connect','bot'], q:"How do I reach support on Telegram?", a:'Click the Telegram button in the Help panel Contact tab or message t.me/velocityfuel on Telegram to connect with our support team.' },

  // ===== TECHNICAL =====
  { id:'t1', intents:['technical','fueling'], tags:['qr','code','not','scanning','scan','reader','camera','not working'], q:"Why is the QR code not scanning?", a:'Make sure your QR code is clean, not damaged, and well-lit. If the station camera cannot scan it, you can manually enter your vehicle plate number instead.' },
  { id:'t2', intents:['technical','account'], tags:['not','receive','verification','code','sms','email','otp','missing'], q:"Why can I not receive the verification code?", a:'Check your spam folder for email codes. For SMS, ensure your phone number is correct. You can request a new code after 2 minutes. If the problem persists, contact support.' },
  { id:'t3', intents:['technical'], tags:['page','not','loading','blank','white','screen','error','refresh'], q:"Why is the page not loading?", a:'Try refreshing the page, clearing your browser cache, or opening in an incognito/private window. Check your internet connection and try a different browser if needed.' },
  { id:'t4', intents:['technical'], tags:['clear','cache','browser','cookies','storage','reset'], q:"How do I clear my cache?", a:'In Chrome: Settings > Privacy and Security > Clear browsing data > Cached images and files. In Firefox: History > Clear Recent History > Cache. In Edge: Settings > Privacy > Clear browsing data.' },
  { id:'t5', intents:['technical'], tags:['screen','size','responsive','mobile','desktop','fit','zoom','layout'], q:"Does VeloCity work on all screen sizes?", a:'VeloCity is responsive and works on desktop, tablet, and mobile devices. The interface adapts to your screen size for an optimal experience.' },
  { id:'t6', intents:['technical','general'], tags:['enable','notification','allow','permission','browser','prompt'], q:"How do I enable notifications?", a:'Your browser will prompt you to allow notifications when you first log in. Click "Allow" to receive alerts. You can change this in your browser settings anytime.' },
  { id:'t7', intents:['technical','general'], tags:['notification','not','receiving','push','alert','missing'], q:"Why am I not receiving notifications?", a:'Check that notifications are enabled in your browser settings and that you have not muted them. Also check your notification preferences in the app settings.' },
  { id:'t8', intents:['technical','general'], tags:['update','app','version','upgrade','latest','new'], q:"How do I update the app?", a:'The web app updates automatically when you refresh the page. For the mobile app, check your app store for available updates.' },
  { id:'t9', intents:['technical','account'], tags:['forget','role','what','am','i','dont','remember'], q:"What if I forget my role?", a:'Your role is displayed on your profile page and dashboard header. You can also check your account settings to see your assigned role.' },
  { id:'t10', intents:['technical'], tags:['map','not','loading','stations','map','blank','no stations'], q:"The map is not showing stations, why?", a:'Make sure your browser has location access enabled. Try refreshing the page. If stations still do not appear, check that there are stations available in your area.' },
  { id:'t11', intents:['technical','fueling'], tags:['qr','generator','not','working','refuel','quota','generate'], q:"The QR generator is not working, why?", a:'Make sure you have sufficient wallet balance and your subscription is active. Try refreshing the page. If it still does not work, contact support.' },
  { id:'t12', intents:['technical','payment'], tags:['payment','fail','failed','transaction','declined','error','processing'], q:"Why did my payment fail?", a:'Common causes: insufficient wallet balance, exceeded daily limit, or network issues. Check your wallet balance and daily limit, then try again.' },
  { id:'t13', intents:['technical'], tags:['error','message','code','meaning','what','does','mean'], q:"What does an error code mean?", a:'Error codes are logged in your transaction history and notifications. For specific error code meanings, contact support with the code and what you were doing.' },
  { id:'t14', intents:['technical'], tags:['refresh','reload','restart','reset','app','page'], q:"How do I refresh or restart the app?", a:'Simply refresh your browser page (F5 or Ctrl+R). This will reload the app and fetch the latest version from the server.' },
];

const synonyms = {
  hello: ['hi','hey','yo','sup','howdy','greetings','good morning','good afternoon','good evening','whats up'],
  goodbye: ['bye','goodbye','see you','see ya','later','take care','gtg','bye bye','cya','catch you later','peace'],
  thanks: ['thanks','thank you','thx','ty','appreciate','cheers','thank','much appreciated'],
  create: ['make','open','start','set','up','establish','register','new','form'],
  account: ['profile','user','login','credentials','signin','registration'],
  fuel: ['gas','petrol','diesel','refuel','fill','pump','gasoline','petroleum'],
  vehicle: ['car','truck','van','auto','automobile','transport','taxi','bus','motorbike','motorcycle'],
  wallet: ['balance','fund','money','credit','account','payment','purse'],
  station: ['pump','gas station','fuel station','depot','location','garage','outlet'],
  help: ['support','assist','guide','tutorial','walkthrough','faq','aid'],
  password: ['pass','pw','pin','secret','credentials','key'],
  admin: ['manager','supervisor','administrator','moderator','oversight'],
  pay: ['payment','charge','cost','price','fee','rate','deduct','billing'],
  plan: ['subscription','tier','package','pricing','membership','scheme'],
  queue: ['line','wait','waiting','standing','position','queue'],
  qr: ['qrcode','barcode','code','scan','sticker','label'],
  register: ['signup','enroll','join','subscribe','create','onboard'],
  problem: ['issue','error','bug','glitch','trouble','difficulty','malfunction'],
  money: ['cash','funds','balance','credit','payment','currency'],
};

function normalize(text) {
  return text.toLowerCase().replace(/[?.,!;:'"()-]/g, '').trim();
}

function wordTokenize(text) {
  return normalize(text).split(/\s+/).filter(w => w.length > 0);
}

function charBigrams(word) {
  const grams = new Set();
  for (let i = 0; i < word.length - 1; i++) grams.add(word.slice(i, i + 2));
  return grams;
}

function bigramSimilarity(a, b) {
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
  const ga = charBigrams(a);
  const gb = charBigrams(b);
  let intersection = 0;
  for (const g of ga) if (gb.has(g)) intersection++;
  const union = ga.size + gb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function expandWords(words) {
  const expanded = new Set();
  for (const w of words) {
    expanded.add(w);
    for (const [key, vals] of Object.entries(synonyms)) {
      if (w === key || vals.includes(w)) {
        expanded.add(key);
        vals.forEach(v => expanded.add(v));
      }
    }
  }
  return [...expanded];
}

const intentKeywords = {
  account: ['account','register','signup','login','password','create','sign','verify','profile','email','phone'],
  fueling: ['refuel','fuel','fill','pump','gas','petrol','qr','scan','station','appointment','queue'],
  payment: ['wallet','pay','money','fund','cost','price','transaction','balance','deposit','integrity','fee'],
  subscription: ['subscription','plan','tier','upgrade','limit','daily','basic','premium','enterprise','renew'],
  fleet: ['fleet','multiple','vehicle','owner','driver','track','consume','fleet owner'],
  station: ['station','queue','appointment','book','schedule','wait','time','open','closed','hour'],
  security: ['theft','fraud','stolen','blocked','suspend','secure','protect','report','dispute'],
  roles: ['role','worker','manager','admin','driver','owner','permission','job','duties'],
  general: ['what','is','language','theme','demo','offline','mobile','browser','technology','version'],
  support: ['contact','support','help','issue','problem','refund','error','bug','technical'],
  technical: ['not working','error','bug','loading','scan','qr','cache','refresh','slow','notification'],
  vehicle: ['vehicle','car','truck','motorcycle','license','plate','qr code'],
};

function classifyIntent(clean) {
  const words = normalize(clean).split(/\s+/);
  let best = 'general';
  let bestCount = 0;
  for (const [intent, kws] of Object.entries(intentKeywords)) {
    let count = 0;
    for (const w of words) {
      for (const kw of kws) {
        if (w === kw || w.startsWith(kw) || kw.startsWith(w)) count++;
      }
    }
    if (count > bestCount) { bestCount = count; best = intent; }
  }
  return best;
}

function computeMatchScore(query, entry) {
  const queryWords = wordTokenize(query);
  if (queryWords.length === 0) return { score: 0, matchesKeyword: false };
  const queryExpanded = expandWords(queryWords);
  const entryTags = entry.tags.map(t => t.toLowerCase());
  const entryWords = wordTokenize(entry.q);

  let tagScore = 0;
  let matchesKeyword = false;
  for (const qw of queryExpanded) {
    for (const et of entryTags) {
      if (qw === et) { tagScore += 4; matchesKeyword = true; }
      else if (qw.includes(et) || et.includes(qw)) tagScore += 2.5;
    }
  }

  let qScore = 0;
  for (const qw of queryExpanded) {
    for (const ew of entryWords) {
      if (qw === ew) qScore += 3;
      else if (qw.includes(ew) || ew.includes(qw)) qScore += 1.5;
    }
  }

  let fuzzyScore = 0;
  const queryStr = normalize(query);
  const entryStr = normalize(entry.q);
  if (queryStr.length > 2 && entryStr.length > 2) {
    fuzzyScore = bigramSimilarity(queryStr, entryStr) * 5;
  }

  let intentScore = 0;
  const qIntent = classifyIntent(query);
  if (entry.intents.includes(qIntent)) intentScore = 2;

  const answerStr = normalize(entry.a);
  let answerBoost = 0;
  for (const qw of queryExpanded) {
    if (answerStr.includes(qw)) answerBoost += 0.3;
  }

  let lenPenalty = 0;
  if (queryWords.length <= 2 && queryExpanded.length <= 3) lenPenalty = -1;

  const total = tagScore + qScore + fuzzyScore + intentScore + answerBoost + lenPenalty;

  return { score: total, matchesKeyword };
}

function findBestMatch(query) {
  const scores = kb.map(e => ({ entry: e, ...computeMatchScore(query, e) }));
  scores.sort((a, b) => b.score - a.score);
  return { best: scores[0], top5: scores.slice(0, 5) };
}

function getGreetingResponse(clean) {
  const greetings = ['hi','hello','hey','good morning','good afternoon','good evening','yo','sup','howdy','greetings','whats up',"what's up",'hey there','hello there','hi there'];
  if (greetings.some(g => clean === g || clean.startsWith(g + ' ') || clean.startsWith(g + ',') || clean === g + '!')) {
    return "Hello! I am your VeloCity assistant. I can help with accounts, fueling, subscriptions, fleet management, payments, stations, security, and more. What would you like to know?";
  }
  return null;
}

function getThanksResponse(clean) {
  const thanks = ['thanks','thank you','thx','ty','appreciate it','cheers','thank','thanks!','thanks a lot','thank you so much','much appreciated','thanks mate'];
  if (thanks.some(t => clean === t || clean.startsWith(t + ' ') || clean.endsWith(t))) {
    return "You are welcome! Anything else you would like to ask about VeloCity?";
  }
  return null;
}

function getByeResponse(clean) {
  const bye = ['bye','goodbye','see you','see ya','later','take care','gtg','bye bye','cya','see you later','catch you later','farewell'];
  if (bye.some(b => clean === b || clean.startsWith(b))) {
    return "Goodbye! Feel free to come back anytime if you need help with VeloCity.";
  }
  return null;
}

const quickActions = [
  { label: 'Create Account', icon: User, query: 'How do I create an account?' },
  { label: 'How to Refuel', icon: Fuel, query: 'How do I refuel at a station?' },
  { label: 'Subscription Plans', icon: CreditCard, query: 'What subscription plans are available?' },
  { label: 'Fleet Management', icon: Truck, query: 'How do fleet owners manage drivers?' },
  { label: 'Report Issue', icon: Shield, query: 'What should I do if I suspect fuel theft?' },
];

const iconMap = { User, Fuel, CreditCard, Truck, Shield, HelpCircle, Settings, MapPin, Car, Phone, MessageCircle, Mail, AlertCircle };

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I am your VeloCity AI Assistant. Ask me anything about the system and I will answer instantly.", quickActions: true },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [context, setContext] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    const clean = normalize(msg);

    const greeting = getGreetingResponse(clean);
    if (greeting) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: greeting, quickActions: true }]);
      return;
    }

    const thanks = getThanksResponse(clean);
    if (thanks) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: thanks }]);
      return;
    }

    const bye = getByeResponse(clean);
    if (bye) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: bye }]);
      return;
    }

    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

    const { best, top5 } = findBestMatch(clean);
    const score = best.score;

    if (score >= 7 && best.matchesKeyword) {
      setContext({ lastId: best.entry.id, lastIntent: best.entry.intents[0] });
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: best.entry.a }]);
      return;
    }

    if (score >= 4) {
      setContext({ lastId: best.entry.id, lastIntent: best.entry.intents[0] });
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: best.entry.a }]);
      return;
    }

    if (context && context.lastId) {
      const lastEntry = kb.find(e => e.id === context.lastId);
      if (lastEntry) {
        const related = kb.filter(e => e.id !== context.lastId && e.intents.some(i => lastEntry.intents.includes(i))).slice(0, 3);
        if (related.length > 0) {
          const suggestions = related.map(e => e.q).join('\n\u2022 ');
          setContext(null);
          setTyping(false);
          setMessages(prev => [...prev, {
            role: 'bot',
            text: `I could not quite find a match for that. Based on what we were discussing, here are related topics:\n\n\u2022 ${suggestions}\n\nOr rephrase your question.`,
          }]);
          return;
        }
      }
    }

    const fallbacks = top5.filter(t => t.score > 1);
    if (fallbacks.length > 0) {
      const suggestions = [...new Set(fallbacks.map(f => f.entry.q))].slice(0, 4).map(q => `\u2022 ${q}`).join('\n');
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `Here are some topics I can help with:\n\n${suggestions}\n\nOr try rephrasing your question!`,
      }]);
      return;
    }

    const intent = classifyIntent(clean);
    const byIntent = kb.filter(e => e.intents.includes(intent)).slice(0, 4);

    if (byIntent.length > 0) {
      const suggestions = byIntent.map(e => `\u2022 ${e.q}`).join('\n');
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `I can help with these ${intent} topics:\n\n${suggestions}\n\nPick one or tell me more!`,
      }]);
      return;
    }

    setTyping(false);
    setMessages(prev => [...prev, {
      role: 'bot',
      text: "I can help with many topics! Pick one below or ask about anything related to VeloCity:\n\n\u2022 Creating & managing accounts\n\u2022 Fueling at stations\n\u2022 Subscription plans & pricing\n\u2022 Fleet management\n\u2022 Appointments & queues\n\u2022 Security & reporting\n\u2022 Wallet & payments\n\u2022 Roles & permissions\n\u2022 Technical support\n\u2022 Vehicles & QR codes",
      quickActions: true,
    }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="cb-floating">
      <div className="cb-header">
        <div className="cb-header-left">
          <div className="cb-avatar"><Bot size={18} /></div>
          <div>
            <div className="cb-title">VeloCity Assistant</div>
            <div className="cb-status"><span className="cb-dot" /> Online</div>
          </div>
        </div>
        <button className="cb-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="cb-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`cb-msg ${m.role === 'bot' ? 'cb-msg--bot' : 'cb-msg--user'}`}>
            {m.role === 'bot' && <div className="cb-msg-avatar"><Bot size={14} /></div>}
            <div className="cb-bubble">
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{m.text}</p>
              {m.quickActions && (
                <div className="cb-actions">
                  {quickActions.map((act, ai) => {
                    const IconComp = iconMap[act.icon] || HelpCircle;
                    return (
                      <button key={ai} className="cb-action-btn" onClick={() => handleSend(act.query)}>
                        <IconComp size={13} /> {act.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="cb-msg cb-msg--bot">
            <div className="cb-msg-avatar"><Bot size={14} /></div>
            <div className="cb-bubble cb-typing">
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="cb-input-bar">
        <input
          ref={inputRef}
          className="cb-input"
          placeholder="Ask me anything about VeloCity..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="cb-send" onClick={() => handleSend()} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
