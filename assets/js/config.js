import axios from "axios";
const apiAdminUrl='https://livejs-api.hexschool.io/api/livejs/v1/admin/bftsai/'; //admin
const apiCustomerUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/bftsai/'; //customer
const uId='tkTk1S9IgGeDvn5yWsyd7skDl3x2';

export const ajax={
    async getProduct(){
        try {
          const result=await axios.get(`${apiCustomerUrl}products`);
          return result.data.products;
        } catch (err) {
            console.log(err);
        }
    },
    async getShoppingCar(){
        try {
            const result=await axios.get(`${apiCustomerUrl}carts`);
            return result.data.carts;
        } catch (err) {
            console.log(err);
        }
    },
    async addShoppingCar(id,quantity){
        try {
            let obj={};
            obj.data={};
            obj.data.productId=id;
            obj.data.quantity=quantity;
            const result=await axios.post(`${apiCustomerUrl}carts`,obj);
            return result;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteShoppingCarById(id){
        try {
            const result=await axios.delete(`${apiCustomerUrl}carts/${id}`);
            return result.data.carts;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteAllShoppingCar(){
        try {
            const result=await axios.delete(`${apiCustomerUrl}carts`);
            console.log(result.data.message);
            return result.data.carts;
        } catch (err) {
            console.log(err);
        }
    },
    async postOrder(obj){
        try {
            const result=await axios.post(`${apiCustomerUrl}orders`,obj);
            return result.data;
        } catch (err) {
            console.log(err);
        }
    },
    async getAdminOrders(){
        try {
            const result=await axios.get(`${apiAdminUrl}orders`,{
                headers:{
                    "authorization": uId
                }
            });
            return result.data.orders;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteOrderById(id){
        try {
            const result=await axios.delete(`${apiAdminUrl}orders/${id}`,{
                headers:{
                    "authorization": uId
                }
            });
            return result.data.message;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteAllOrders(){
        try {
            const result=await axios.delete(`${apiAdminUrl}orders`,{
                headers:{
                    "authorization": uId
                }
            });
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }
}