import { ajax } from "./config";


const component={
    data:[],
    async init(){
        this.data=await ajax.getAdminOrders();
        if(this.data.length!==0){
            this.renderOrderPage();
        }else{
            discardAllBtn.setAttribute('disabled','');
            chartSummaryTable.classList.add('d-none');
        }
    },
    renderOrderPage(){
        tbody.innerHTML='';
        let countItemObj={},countProductObj={};
        this.data.forEach(item=>{
            item.products.forEach(itemProduct=>{
                if(countItemObj[itemProduct.title]===undefined){
                    countItemObj[itemProduct.title]=itemProduct.price;
                }else{
                    countItemObj[itemProduct.title]+=itemProduct.price;
                }
                if (countProductObj[itemProduct.category]===undefined) {
                    countProductObj[itemProduct.category]=itemProduct.price;
                }else{
                    countProductObj[itemProduct.category]+=itemProduct.price;
                }
                const tr=document.createElement('tr');
                tbody.appendChild(tr);

                let td=document.createElement('td');
                td.textContent=item.id;
                tr.appendChild(td);

                td=document.createElement('td');
                tr.appendChild(td);
                let p=document.createElement('p');
                p.textContent=item.user.name;
                td.appendChild(p);
                p=document.createElement('p');
                p.textContent=item.user.tel;
                td.appendChild(p);

                td=document.createElement('td');
                td.textContent=item.user.address;
                tr.appendChild(td);

                td=document.createElement('td');
                td.textContent=item.user.email;
                tr.appendChild(td);

                td=document.createElement('td');
                tr.appendChild(td);
                p=document.createElement('p');
                p.textContent=itemProduct.title;
                td.appendChild(p);

                td=document.createElement('td');
                td.textContent=new Date(item.createdAt).toLocaleString().split(' ')[0];
                tr.appendChild(td);

                td=document.createElement('td');
                td.className='orderStatus';
                tr.appendChild(td);
                const orderStatusLink=document.createElement('a');
                orderStatusLink.className='orderStatusLink';
                orderStatusLink.href='#';
                orderStatusLink.textContent=`${item.paid===false? '未處理':'已處理'}`;
                td.appendChild(orderStatusLink);

                td=document.createElement('td');
                tr.appendChild(td);
                const delSingleOrderBtn=document.createElement('input');
                delSingleOrderBtn.className='delSingleOrder-Btn';
                delSingleOrderBtn.type='button';
                delSingleOrderBtn.value='刪除';
                delSingleOrderBtn.setAttribute('data-id',item.id);
                td.appendChild(delSingleOrderBtn);

                delSingleOrderBtn.addEventListener('click',async e=>{
                    tbody.parentElement.parentElement.previousElementSibling.previousElementSibling.classList.remove('d-none');
                    const orderId=e.target.getAttribute('data-id');
                    await this.deleteOrderById(orderId);
                    this.data=await ajax.getAdminOrders();
                    this.renderOrderPage();
                    tbody.parentElement.parentElement.previousElementSibling.previousElementSibling.classList.add('d-none');
                })
            })
        });
        
        this.renderItemC3(countItemObj);
        this.renderProductC3(countProductObj);
        chartSummaryTable.classList.remove('d-none');
    },
    renderItemC3(obj){
        const newArr=[];
        Object.keys(obj).forEach((item,index)=>{
            let arr=[item,Object.values(obj)[index]];
            newArr.push(arr);
        });
        
        newArr.sort((a,b)=>{
            return b[1]-a[1];
        });
        
        let arr=['其他',0];
        newArr.forEach((item,index)=>{
            if(index>=3){
                arr[1]+=item[1];
            }
        });
        newArr.splice(3,(newArr.length-3));
        newArr.push(arr);
        // C3.js
        let chart = c3.generate({
            bindto: '#chart', // HTML 元素綁定
            data: {
                type: "pie",
                columns: newArr,
                colors:{
                    "Louvre 雙人床架":"#DACBFF",
                    "Antony 雙人床架":"#9D7FEA",
                    "Anty 雙人床架": "#5434A7",
                    "其他": "#301E5F",
                }
            },
        });
    },
    renderProductC3(obj){
        let newArr=[];
        Object.keys(obj).forEach((item,index)=>{
            let arr=[item,Object.values(obj)[index]];
            newArr.push(arr);
        })
        // C3.js
        let chart1 = c3.generate({
            bindto: '#chart1', // HTML 元素綁定
            data: {
                type: "pie",
                columns: newArr,
                colors:{
                    "Louvre 雙人床架":"#DACBFF",
                    "Antony 雙人床架":"#9D7FEA",
                    "Anty 雙人床架": "#5434A7",
                    "其他": "#301E5F",
                }
            },
        });
    },
    async deleteOrderById(id){
        await ajax.deleteOrderById(id);
        await ajax.getAdminOrders();
        if(this.data!==0){
            this.renderOrderPage();
        }else{
            discardAllBtn.setAttribute('disabled','');
        }
    },
    async deleteAllOrders(){
        if(this.data.length!==0){
            discardAllBtn.previousElementSibling.classList.remove('d-none');
            this.data=await ajax.deleteAllOrders();
            discardAllBtn.previousElementSibling.classList.add('d-none');
            this.renderOrderPage();
        }else{
            console.log(0);
        }
    }
};
const chartSummaryTable=document.querySelector('.chartSummaryTable');
const discardAllBtn=document.querySelector('.discardAllBtn');
const orderPageTable=document.querySelector('.orderPage-table');
const tbody=document.createElement('tbody');
orderPageTable.appendChild(tbody);
component.init();
discardAllBtn.addEventListener('click',e=>{
    e.preventDefault();
    component.deleteAllOrders();
});

//carousel
const msoLeft=document.querySelector('.mso-left');
const msoRight=document.querySelector('.mso-right');
const chartProduct=document.querySelector('.chartProduct');
const chartItem=document.querySelector('.chartItem');
msoLeft.addEventListener('click',e=>{
    chartProduct.classList.add('translateX-start-100');
    chartItem.classList.add('translateX-start-100');
    msoLeft.classList.add('text-secondary');
    msoLeft.classList.remove('msoHover');
    msoRight.classList.remove('text-secondary');
    msoRight.classList.add('msoHover');
});
msoRight.addEventListener('click',e=>{
    if(chartProduct.className.includes('translateX-start-100')){
        chartItem.classList.remove('translateX-start-100');
        chartProduct.classList.remove('translateX-start-100');
        msoRight.classList.add('text-secondary');
        msoRight.classList.remove('msoHover');
        msoLeft.classList.remove('text-secondary');
        msoLeft.classList.add('msoHover');
    }
});
