'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-06-08T14:43:26.374Z',
    '2023-06-10T18:49:59.371Z',
    '2023-06-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bankist:
//opacity(in .app in CSS) = 0    -->hides the UI

//Displaying date:
const format_date = function(date , locale) {
  const calc_days_passed = function(date1 , date2) {
    return Math.round(Math.abs(date2 - date1) / (1000*60*60*24));
  };
  const days_passed = calc_days_passed(new Date() , date);
  if(days_passed === 0) return 'Today';
  else if(days_passed === 1) return 'Yesterday';
  else if(days_passed <=7) return `${days_passed} days ago.`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
    //OPTIMIZE Internationalized.
    // const day = `${date.getDate()}`.padStart(2 , 0);
    // const month = `${date.getMonth()+1}`.padStart(2 , 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
  };
};


//Displaying currencies:
const format_cur = function(value , locale , currency) {
  return new Intl.NumberFormat(locale , {
    style : 'currency' ,
    currency : currency,
  } ).format(value);
};


//First we gotta display the account's movements.
const display_movements = function (acc , sort=false) {
  //Empty the movements countainer:
  containerMovements.innerHTML = '';
  //Sort Implementation:
  //We want to show a soerted version of the movements not sort the original movements array. 
  //So we create a copy using the slice method.
  const movs = sort ? acc.movements.slice().sort((a,b)=> a-b) : acc.movements;
  //Displaying the movements:
  movs.forEach(function (mov, i) {
    //We gotta create an html element.
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //Figure out the date;
    const now_date = new Date(acc.movementsDates[i]);
    const display_date = format_date(now_date , acc.locale);
    //Formatting the movement's numbers:
    const formatted_mov = format_cur(mov , acc.locale , acc.currency);
    //Putting the movement data into html element.
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${display_date}</div>
      <div class="movements__value">${formatted_mov}</div>
    </div>`;
    //Put the html element into the movement countainer:
    //'after begin' makes it as a stack. 'before end' makes it as a list.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



//Computing Usernames:
const create_username = function(accounts) {
  accounts.forEach( function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
create_username(accounts);


//Compute Balance:
const compute_display_balance = function(account) {
  account.balance = account.movements.reduce((acc , mov) => acc + mov , 0);
  //Formatting the balance's numbers:
  const formatted_bal = format_cur(account.balance , account.locale , account.currency);
  labelBalance.textContent = formatted_bal;
};


//Compute In , Out and Interest
const calc_display_summary = function(account) {
  const sum_in = account.movements.filter(mov => mov>0).reduce((acc , cur) => acc+cur ,0);
  const sum_out = account.movements.filter(mov => mov<0).reduce((acc , cur) => acc+cur ,0);
  //Display
  labelSumIn.textContent = format_cur(sum_in , account.locale , account.currency);
  labelSumOut.textContent = format_cur(Math.abs(sum_out) , account.locale , account.currency);
  labelSumInterest.textContent = format_cur(sum_in * (account.interestRate/100) , account.locale , account.currency);
};


const updateUI = function(cur_user) {
  //Calculate and display balance
  compute_display_balance(cur_user);
  //Display movements
  display_movements(cur_user);
  //Calculate and display summary
  calc_display_summary(cur_user); 
}

//Create a variable to hold the current user.
let cur_user , timer;

// Fake always logged in:
cur_user = account1;
updateUI(cur_user);
containerApp.style.opacity = 100;

//Handling timer:
const start_logout_timer = function() {
  const tick = function () {
    const min = `${Math.trunc(my_time/60)}`.padStart(2 , 0);
    const sec = `${my_time%60}`.padStart(2,0);
    //Print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //when 0 seconds stop timer and logout
    if( my_time === 0) {
      clearInterval(timer);
      //Log out:
      labelWelcome.textContent = `Login to Get Started.`;
      containerApp.style.opacity = 0;
       //Decrese 1 second:
      my_time--; 
    };
  };
  //Set time to 5 mins.
  let my_time = 10;
  //Call the timer every second to display
  //right away the tick runs and after that every one second.
  tick();
  const timer = setInterval( tick, 1000);
  return timer;
};



//Log in:
btnLogin.addEventListener('click' , function(e) {
  /*When we click on the button, the page automatically refreshes because this is the button in
  a form element and in html the default bahavior when we click the submit button is for the
  page to reload. We gotta stop that from happening.*/
  e.preventDefault();
  //Hittng 'enter' in any of the fields(use and pin) will cause the login button to click.
  //Reading value from input field:
  cur_user = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(cur_user); 
  //Check the pin after we checked if the cur_user exists.
  if(cur_user?.pin === +inputLoginPin.value) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome Back ${cur_user.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    //Date Lable:
    const now_date = new Date();
    //OPTIMIZE Internationalizing!
    // const day = `${now_date.getDate()}`.padStart(2 , 0);
    // const month = `${now_date.getMonth()}`.padStart(2 , 0);
    // const year = now_date.getFullYear();
    // const hour = `${now_date.getHours()}`.padStart(2 , 0);
    // const minute = `${now_date.getMinutes()}`.padStart(2 , 0);
    // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${minute}`;
    //FIXME why it shows my time instead of the local's?
    const options = {
      hour : 'numeric',
      minute : 'numeric',
      day : 'numeric',
      month : 'numeric',
      year : 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(cur_user.locale , options).format(now_date);
    //Timer:
    //If there's already a timer ticking stop it;
    if(timer) clearInterval(timer);
    timer = start_logout_timer();
    //Update UI:
    updateUI(cur_user);
    //Clear input fields and remove the focus:
    inputLoginUsername.value = inputLoginPin.value = ''; 
    inputLoginPin.blur();
  };

});


//Transfer:
btnTransfer.addEventListener('click' , function(e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciever = accounts.find(acc=> acc.username === inputTransferTo.value);
  //Clear fields:
  inputTransferAmount.value = inputTransferTo.value = '';
  //Check for the validation of transfer
  if(amount > 0 && 
    reciever &&
    cur_user.balance >= amount &&
    reciever.username !== cur_user.username ) {
      //Doing the transfer
      cur_user.movements.push(-amount);
      reciever.movements.push(amount);
      //Add transfer date:
      cur_user.movementsDates.push(new Date().toISOString());
      reciever.movementsDates.push(new Date().toISOString());
      //Update UI:
      updateUI(cur_user);
      //Reset the timer:
      clearInterval(timer);
      timer = start_logout_timer();
  }
});



//Request a loan:
btnLoan.addEventListener('click' , function(e) {
  e.preventDefault();
  //Math.floor does the type conversion from string to number.
  const loan_amount = Math.floor(inputLoanAmount.value);
  //Check for loan conditions: if there's any deposit with 10% of the loan amount
  if(loan_amount>0 && cur_user.movements.some(mov=> mov>=0.1*loan_amount)) {
    //Set timer because it takes time to get a loan!
    setTimeout(function () {
      //Add movement:
      cur_user.movements.push(loan_amount);
      //Add loan date:
      cur_user.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(cur_user);
      //Clear fields:
      inputLoanAmount.value = '';
      //Reset the timer:
      clearInterval(timer);
      timer = start_logout_timer();
    } , 2500);

  };
});


//Closing an account:
btnClose.addEventListener('click' , function(e) {
  e.preventDefault();
  if(cur_user.username === inputCloseUsername.value && cur_user.pin === +inputClosePin.value) {
    //'findIndex' returns the index of first element that matches the condition.
    const index = accounts.findIndex(acc => acc.username === cur_user.username);
    //From the account index delete one element from the accounts list:
    accounts.splice(index , 1);
    //Hide the UI:
    containerApp.style.opacity = 0;
  };
  //Clear fields:
  inputClosePin.value = inputCloseUsername.value = '';
});


//Sort:
//if we click on sort button the second time it should show the original order of the movements. so we create a variable to preserve the sorting state.
let sorted = false;
btnSort.addEventListener('click' , function(e) {
  e.preventDefault();
  display_movements(cur_user , !sorted);
  sorted = !sorted;
});



