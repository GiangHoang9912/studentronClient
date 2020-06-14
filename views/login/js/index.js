const { ipcRenderer } = require('electron')

document.querySelector('button').addEventListener('click', async (event) => {
  event.preventDefault();

  const userName = document.querySelector('#name').value;
  const pass = document.querySelector('#pass').value;

  const user = {
    userName: userName,
    pass: pass
  }

  await fetch(`http://localhost:3000/login`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    return res.json();
  }).then((data) => {
    if (data) {
      ipcRenderer.send('accept-login-message', data);
    }
    else
      console.log('account wrong')
  }).catch(() =>
    console.log('login fail')
  )
})

ipcRenderer.once('send-session', (event, user) => {
  sessionStorage.setItem("rule", user.rule);
  sessionStorage.setItem("name", user.userName);
  sessionStorage.setItem("id", user.id);

  ipcRenderer.send('send-session', sessionStorage)
})

// (function ($) {
//     "use strict";


//     /*==================================================================
//     [ Focus input ]*/
//     $('.input100').each(function () {
//         $(this).on('blur', function () {
//             if ($(this).val().trim() != "") {
//                 $(this).addClass('has-val');
//             }
//             else {
//                 $(this).removeClass('has-val');
//             }
//         })
//     })


//     /*==================================================================
//     [ Validate ]*/
//     var input = $('.validate-input .input100');

//     $('.validate-form').on('submit', function () {
//         var check = true;

//         for (var i = 0; i < input.length; i++) {
//             if (validate(input[i]) == false) {
//                 showValidate(input[i]);
//                 check = false;
//             }
//         }

//         return check;
//     });


//     $('.validate-form .input100').each(function () {
//         $(this).focus(function () {
//             hideValidate(this);
//         });
//     });

//     function validate(input) {
//         if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
//             if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
//                 return false;
//             }
//         }
//         else {
//             if ($(input).val().trim() == '') {
//                 return false;
//             }
//         }
//     }

//     function showValidate(input) {
//         var thisAlert = $(input).parent();

//         $(thisAlert).addClass('alert-validate');
//     }

//     function hideValidate(input) {
//         var thisAlert = $(input).parent();

//         $(thisAlert).removeClass('alert-validate');
//     }

//     /*==================================================================
//     [ Show pass ]*/
//     var showPass = 0;
//     $('.btn-show-pass').on('click', function () {
//         if (showPass == 0) {
//             $(this).next('input').attr('type', 'text');
//             $(this).addClass('active');
//             showPass = 1;
//         }
//         else {
//             $(this).next('input').attr('type', 'password');
//             $(this).removeClass('active');
//             showPass = 0;
//         }

//     });


// })(jQuery);