import SSLCommerzPayment from "sslcommerz-lts"
const store_id = 'creat67794bf34f9b6'
const store_passwd = 'creat67794bf34f9b6@ssl'
const is_live = false 


let test = {}
let user = {}
const pay = async(req,res,next)=>{
    const {total,orderId,name,address,city,email,phone,postcode,district} = req.body
    
    const data = {
        total_amount: total,
        currency: 'BDT',
        tran_id: orderId, // use unique tran_id for each api call
        success_url: 'http://localhost:8000/api/v1/pay/success',
        fail_url: 'http://localhost:8000/api/v1/pay/fail',
        cancel_url: 'http://localhost:8000/api/v1/pay/cancel',
        ipn_url: 'http://localhost:8000/api/v1/pay/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: address,
        cus_add2: address,
        cus_city: city,
        cus_state: district,
        cus_postcode: postcode,
        cus_country: 'Bangladesh',
        cus_phone: phone,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        test = req.body
        req.user = user
        let GatewayPageURL = apiResponse.GatewayPageURL
        //res.redirect(GatewayPageURL)
        //console.log('Redirecting to: ', GatewayPageURL)
        //paySuccess(req.body)
        // req.paymentData = data
        console.log(apiResponse);
        
        return res.json({url: GatewayPageURL})
    });
}

const paySuccess = async(req,res,next)=>{
    
   req.order = test
   req.user = user
   next()
}

export{ pay,paySuccess }