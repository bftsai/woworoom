export const checkOrder={  
    name(str){
        const nameReg=new RegExp('[A-Za-z\u4e00-\u9fa5\\x20]');
        const strArr=str.split(nameReg);
        for (let index = 0; index < strArr.length; index++) {
            if(strArr[index]!==''){
                return false;
            }
        }
        return true;
    },
    phone(str){
        const phoneReg=new RegExp('^09[0-9]{8}$');
        return phoneReg.test(str);
    },
    mail(str){
        const mailReg=new RegExp('^[\\w]+@[\\w]+\\.[\\w]{3,6}(\\.[\\w]{2,6})?$');
        return mailReg.test(str);
    },
    address(str){
        if(str!==''){
            return true;
        }else{
            return false;
        }
    }
}

export function validation(name,phone,email,address) {  
    if(checkOrder.name(name.value)&&checkOrder.phone(phone.value)&&checkOrder.mail(email.value)&&checkOrder.address(address.value)){
        return true;    
    }
}