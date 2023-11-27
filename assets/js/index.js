import { ajax } from "./config.js";
import { checkOrder,validation } from "./validation.js";
const indexHtml='http://localhost:5173/woworoom/pages/index.html';
//product area

const productWrap=document.querySelector('.productWrap');
//shopping car area
const shoppingCartTable=document.querySelector('.shoppingCart-table');


const component={
    data:[],
    async init(){
        this.data=await ajax.getProduct();
        if(this.data.length!==0){
            this.renderProductWrap();
        }
        
        this.data=await ajax.getShoppingCar();
        if(this.data.length===0){
            shoppingCartTable.classList.add('d-none');
        }else if(this.data.length!==0){
            console.log(this.data);
            shoppingCartTable.classList.remove('d-none');
            this.renderShoppingCart();
        }
    },
    renderProductWrap(){
        productWrap.innerHTML='';
        this.data.forEach(item=>{
            const li=document.createElement('li');
            li.className='productCard';
            productWrap.appendChild(li);

            const h4=document.createElement('h4');
            h4.className='productType';
            h4.textContent='新品';
            const img=document.createElement('img');
            img.src=item.images;
            img.alt='product pic';
            const addCardBtn=document.createElement('a');
            addCardBtn.className='addCardBtn';
            addCardBtn.textContent='加入購物車';
            addCardBtn.href='#';
            addCardBtn.setAttribute('data-id',item.id);
            const h3=document.createElement('h3');
            h3.textContent=item.title;
            const del=document.createElement('del');
            del.className='originPrice';
            del.textContent=item.origin_price;
            const p=document.createElement('p');
            p.className='nowPrice';
            p.textContent=item.price;
            li.appendChild(h4);
            li.appendChild(img);
            li.appendChild(addCardBtn);
            li.appendChild(h3);
            li.appendChild(del);
            li.appendChild(p);
            
            //add carts
            addCardBtn.addEventListener('click',async e=>{
                e.preventDefault();
                const addCarId=e.target.getAttribute("data-id");
                addCardBtn.offsetParent.parentElement.previousElementSibling.previousElementSibling.classList.remove('d-none');
                await ajax.addShoppingCar(addCarId,1);
                
                this.data=await ajax.getShoppingCar();
                addCardBtn.offsetParent.parentElement.previousElementSibling.previousElementSibling.classList.add('d-none');
                if(this.data.length===0){
                    shoppingCartTable.classList.add('d-none');
                }else if(this.data.length!==0){
                    shoppingCartTable.classList.remove('d-none');
                    this.renderShoppingCart();
                }
            })
        })
    },
    async filterProduct(type){
        const data=await ajax.getProduct();
        let productArr=[];
        if(type==='全部'){
            this.data=data;
        }else{
            data.forEach(item=>{
                if(item.category===type){
                    productArr.push(item);
                }
            });
            this.data=productArr;
        }
        this.renderProductWrap();
    },
    renderShoppingCart(){
        shoppingCartTable.innerHTML='';
        let amount=0;
        this.data.forEach(item=>{
            const tr=document.createElement('tr');
            shoppingCartTable.appendChild(tr);

            let td=document.createElement('td');
            tr.appendChild(td);
            const div=document.createElement('div');
            div.className='cardItem-title';
            td.appendChild(div);
            const img=document.createElement('img');
            img.src=item.product.images;
            img.alt='product pic';
            const p=document.createElement('p');
            p.textContent=item.product.title;
            div.appendChild(img);
            div.appendChild(p);

            td=document.createElement('td');
            td.textContent=item.product.price;
            tr.appendChild(td);

            td=document.createElement('td');
            tr.appendChild(td);
            const input=document.createElement('input');
            input.value=item.quantity;
            input.type='number';
            input.setAttribute('data-id',item.id);
            td.appendChild(input);
            

            td=document.createElement('td');
            td.textContent=`NT$${item.product.price*item.quantity}`;
            tr.appendChild(td);
            amount+=item.product.price*item.quantity;

            td=document.createElement('td');
            td.className='discardBtn';
            tr.appendChild(td);
            const discardBtn=document.createElement('a');
            discardBtn.href='#';
            discardBtn.className='material-icons';
            discardBtn.textContent='clear';
            discardBtn.setAttribute('data-id',item.id)
            td.appendChild(discardBtn);
            
            input.addEventListener('keyup',async e=>{
                shoppingCartTable.previousElementSibling.classList.remove('d-none');
                if(e.target.value<=1){
                    e.target.value=1
                }else{
                    e.target.value=e.target.value.replace(/[^\d.]/g,' ');
                }
                const cartId=e.target.getAttribute('data-id');
                
                this.data=await ajax.patchShoppingCar(cartId,Number(e.target.value));
                await this.renderShoppingCart();
                shoppingCartTable.previousElementSibling.classList.add('d-none');
            })
            input.addEventListener('change',async e=>{
                shoppingCartTable.previousElementSibling.classList.remove('d-none');
                if(e.target.value<=1){
                    e.target.value=1
                }else{
                    input.value=e.target.value.replace(/[^\d.]/g,' ');
                }
                const cartId=e.target.getAttribute('data-id');
                this.data=await ajax.patchShoppingCar(cartId,Number(e.target.value));
                await this.renderShoppingCart();
                shoppingCartTable.previousElementSibling.classList.add('d-none');
            })
            
            discardBtn.addEventListener('click',async e=>{
                e.preventDefault();
                const cartId=e.target.getAttribute("data-id");
                discardBtn.parentElement.parentElement.parentElement.previousElementSibling.classList.remove('d-none');
                await ajax.deleteShoppingCarById(cartId);
                
                this.data=await ajax.getShoppingCar();
                discardBtn.parentElement.parentElement.parentElement.previousElementSibling.classList.add('d-none');
                if(this.data.length===0){
                    shoppingCartTable.classList.add('d-none');
                }else if(this.data.length!==0){
                    console.log(this.data);
                    shoppingCartTable.classList.remove('d-none');
                    this.renderShoppingCart();
                }

            })
        });
        if(this.data.length!==0){
            const tr=document.createElement('tr');
            shoppingCartTable.appendChild(tr);

            let td=document.createElement('td');
            tr.appendChild(td);
            const discardAllBtn=document.createElement('a');
            discardAllBtn.href='#';
            discardAllBtn.className='discardAllBtn';
            discardAllBtn.textContent='刪除所有品項';
            td.appendChild(discardAllBtn);

            td=document.createElement('td');
            tr.appendChild(td);
            td=document.createElement('td');
            tr.appendChild(td);

            td=document.createElement('td');
            tr.appendChild(td);
            const p=document.createElement('p');
            p.textContent='總金額';
            td.appendChild(p);

            td=document.createElement('td');
            td.textContent=`NT$${amount}`;
            tr.appendChild(td);
            
            discardAllBtn.addEventListener('click',async e=>{
                e.preventDefault();
                discardAllBtn.parentElement.parentElement.parentElement.previousElementSibling.classList.remove('d-none');
                this.data=await ajax.deleteAllShoppingCar();
                discardAllBtn.parentElement.parentElement.parentElement.previousElementSibling.classList.add('d-none');
                this.renderShoppingCart();
            });
        }
    },
    async postOrder(obj){
        await ajax.postOrder(obj);
        this.data=await ajax.getShoppingCar();
        if(this.data.length===0){
            shoppingCartTable.classList.add('d-none');
        }else if(this.data.length!==0){
            console.log(this.data);
            shoppingCartTable.classList.remove('d-none');
            this.renderShoppingCart();
        }
    }
}
component.init();
//product select
const productSelect=document.querySelector('.productSelect');
productSelect.addEventListener('change',e=>{
    const targetProduct=e.target.value;
    component.filterProduct(targetProduct);
});
//order submit
const orderInfoBtn=document.querySelector('.orderInfo-btn');
const orderInfoForm=document.querySelector('.orderInfo-form');
const customerName=document.getElementById('customerName');
const customerPhone=document.getElementById('customerPhone');
const customerEmail=document.getElementById('customerEmail');
const customerAddress=document.getElementById('customerAddress');
const tradeWay=document.getElementById('tradeWay');
orderInfoBtn.addEventListener('click',async e=>{
    e.preventDefault();
    orderInfoForm.classList.add('was-validated');
    //console.log(customerName.value,customerPhone.value,customerEmail.value,customerAddress.value,tradeWay.value);

    if(customerName.value===''){
        customerName.classList.add('is-invalid');
    }else if(!checkOrder.name(customerName.value)){
        customerName.classList.add('is-invalid');
        customerName.nextElementSibling.textContent='姓名不得為數字或特殊標點符號，如：!、@、#、$、%、^、&、*';
    }else{
        customerName.classList.remove('is-invalid');
    }
    customerName.addEventListener('keyup',e=>{
        if(customerName.value===''){
            customerName.classList.add('is-invalid');
            customerName.nextElementSibling.textContent='必填';
        }else if(!checkOrder.name(customerName.value)){
            customerName.classList.add('is-invalid');
            customerName.nextElementSibling.textContent='姓名不得為數字或特殊標點符號，如：!、@、#、$、%、^、&、*';
        }else{
            customerName.classList.remove('is-invalid');
        }
    });
    customerName.addEventListener('paste',e=>{
        if(customerName.value===''){
            customerName.classList.add('is-invalid');
            customerName.nextElementSibling.textContent='必填';
        }else if(!checkOrder.name(customerName.value)){
            customerName.classList.add('is-invalid');
            customerName.nextElementSibling.textContent='姓名不得為數字或特殊標點符號，如：!、@、#、$、%、^、&、*';
        }else{
            customerName.classList.remove('is-invalid');
        }
    });

    if(customerPhone.value===''){
        customerPhone.classList.add('is-invalid');
        customerPhone.nextElementSibling.textContent='必填';
    }else if(!checkOrder.phone(customerPhone.value)){
        customerPhone.classList.add('is-invalid');
        customerPhone.nextElementSibling.textContent='電話格式錯誤，請輸入格式為0912345678';
    }else{
        customerPhone.classList.remove('is-invalid');
    }
    customerPhone.addEventListener('keyup',e=>{
        if(customerPhone.value===''){
            customerPhone.classList.add('is-invalid');
            customerPhone.nextElementSibling.textContent='必填';
        }else if(!checkOrder.phone(customerPhone.value)){
            customerPhone.classList.add('is-invalid');
            customerPhone.nextElementSibling.textContent='電話格式錯誤，請輸入格式為0912345678';
        }else{
            customerPhone.classList.remove('is-invalid');
        }
    });
    customerPhone.addEventListener('paste',e=>{
        if(customerPhone.value===''){
            customerPhone.classList.add('is-invalid');
            customerPhone.nextElementSibling.textContent='必填';
        }else if(!checkOrder.phone(customerPhone.value)){
            customerPhone.classList.add('is-invalid');
            customerPhone.nextElementSibling.textContent='電話格式錯誤，請輸入格式為0912345678';
        }else{
            customerPhone.classList.remove('is-invalid');
        }
    });

    if(customerEmail.value===''){
        customerEmail.classList.add('is-invalid');
        customerEmail.nextElementSibling.textContent='必填';
    }else if(!checkOrder.mail(customerEmail.value)){
        customerEmail.classList.add('is-invalid');
        customerEmail.nextElementSibling.textContent='Email格式錯誤，請輸入格式為test@mail.com';
    }else{
        customerEmail.classList.remove('is-invalid');
    }
    customerEmail.addEventListener('keyup',e=>{
        if(customerEmail.value===''){
            customerEmail.classList.add('is-invalid');
            customerEmail.nextElementSibling.textContent='必填';
        }else if(!checkOrder.mail(customerEmail.value)){
            customerEmail.classList.add('is-invalid');
            customerEmail.nextElementSibling.textContent='Email格式錯誤，請輸入格式為test@mail.com';
        }else{
            customerEmail.classList.remove('is-invalid');
        }
    });
    customerEmail.addEventListener('paste',e=>{
        if(customerEmail.value===''){
            customerEmail.classList.add('is-invalid');
            customerEmail.nextElementSibling.textContent='必填';
        }else if(!checkOrder.mail(customerEmail.value)){
            customerEmail.classList.add('is-invalid');
            customerEmail.nextElementSibling.textContent='Email格式錯誤，請輸入格式為test@mail.com';
        }else{
            customerEmail.classList.remove('is-invalid');
        }
    });

    if(customerAddress.value===''){
        customerAddress.classList.add('is-invalid');
        customerAddress.nextElementSibling.textContent='必填';
    }else{
        customerAddress.classList.remove('is-invalid');
    }
    customerAddress.addEventListener('keyup',e=>{
        if(customerAddress.value===''){
        customerAddress.classList.add('is-invalid');
        customerAddress.nextElementSibling.textContent='必填';
        }else{
            customerAddress.classList.remove('is-invalid');
        }
    });
    customerAddress.addEventListener('paste',e=>{
        if(customerAddress.value===''){
        customerAddress.classList.add('is-invalid');
        customerAddress.nextElementSibling.textContent='必填';
        }else{
            customerAddress.classList.remove('is-invalid');
        }
    });

    if(validation(customerName,customerPhone,customerEmail,customerAddress)){
        let obj={};
        obj.data={};
        obj.data.user={};
        obj.data.user.name=customerName.value;
        obj.data.user.tel=customerPhone.value;
        obj.data.user.email=customerEmail.value;
        obj.data.user.address=customerAddress.value;
        obj.data.user.payment=tradeWay.value;
        orderInfoBtn.form.previousElementSibling.previousElementSibling.classList.remove('d-none');
        await component.postOrder(obj);
        orderInfoBtn.form.previousElementSibling.previousElementSibling.classList.add('d-none');
        location.href=indexHtml;
    }
});


