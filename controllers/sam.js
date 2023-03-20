// postOtpLogin: (req, res) => {
//     userHelpers.otpLogin(req.body.mobile).then((user) => {
//       console.log("userrrrrrrr ", user);
//       // console.log(user.blocked);
//       if (user == null) {
//         req.session.accountErr = "No account found with the entered number";
//         res.redirect("/otp-login");
//       } else {
//         if (!user.status) {
//           req.session.statusErr = true;
//           res.redirect("/otp-login");
//         } else if (user !== null) {
//           sendOtp.send_otp(user.contact).then((response) => {
//             //  console.log(response);
//             // res.send(`otp sented to ${user.mobile}`);
//             req.session.mobile = req.body.mobile;
//             res.redirect("/otp-varification");
//           });
//         }
//       }
//     });
//   },


//   postOtpVarification: async (req, res) => {
//     try {
//       console.log("postotp verificationnnn");
//       console.log(req.body);
//       let mobile = req.session.mobile;
//       console.log(mobile);
//       let otp = req.body.otp;
//       console.log(otp);
//       sendOtp.verifying_otp(mobile, otp).then((varification) => {
//         console.log(varification.status);
//         if (varification.status == "approved") {
//           console.log("ellam sheriyakum");
//           req.session.email = mobile;
//           res.redirect("/");
//         } else {
//           req.session.otpErr = "Invalid Otp";
//           res.redirect("/otp-varification");
//         }
//       });
//     } catch (err) {
//       console.log(`error: ${err}`);
//     }
//   },







// res.cookie("refreshToken", refreshToken, 
//         {
//             httpOnly:true,
//             maxAge: 72 * 60 * 60 * 1000
//         });  
        
//         const newDetails =  {
//           _id: findAdmin ?. _id,
//              firstname: findAdmin ?. firstname,
//              lastname: findAdmin ?. lastname,
//              email: findAdmin ?. email, 
//              mobile: findAdmin ?. mobile,
//              token: generateToken(findAdmin ?. _id),
//          role: findUser ?. role
//          };

//          res.cookie("newDetails", newDetails,
//             {
//                 httpOnly:true,
//                 maxAge: 72 * 60 * 60 * 1000
//             }
//          );
     
//         res.render('admin/dashboard',{admin:true});

