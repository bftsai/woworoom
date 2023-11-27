import { ajax } from "./config";


const component={
    data:[],
    async init(){
        this.data=await ajax.getAdminOrders();
        //console.log(this.data);
        if(this.data.length!==0){
            this.renderOrderPage();
        }else{
            discardAllBtn.setAttribute('disabled','');
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
                    const orderId=e.target.getAttribute('data-id');
                    await this.deleteOrderById(orderId);
                    this.data=await ajax.getAdminOrders();
                    if(this.data.length===0){
                        discardAllBtn.setAttribute('disabled','');
                        
                    }
                    this.renderOrderPage();
                })
            })
        });
        
        this.renderItemC3(countItemObj);
        this.renderProductC3(countProductObj);
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
        await ajax.deleteAllOrders();
        this.data=await ajax.getAdminOrders();
        if(this.data.length===0){
            discardAllBtn.setAttribute('disabled','');
        }
        this.renderOrderPage();
    }
};

const discardAllBtn=document.querySelector('.discardAllBtn');
const orderPageTable=document.querySelector('.orderPage-table');
const tbody=document.createElement('tbody');
orderPageTable.appendChild(tbody);
component.init();
discardAllBtn.addEventListener('click',e=>{
    component.deleteAllOrders();
});