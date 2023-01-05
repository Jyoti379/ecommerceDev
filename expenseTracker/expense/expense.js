
async function addExpense(event) {
    try {
        event.preventDefault();
        const Expenseamount = event.target.Expenseamount.value;
        const description = event.target.description.value;
        const catagory = event.target.catagory.value;


        const obj = {
            Expenseamount,
            description,
            catagory,

        }
        const token = localStorage.getItem('token')

        await axios.post("http://localhost:3000/expense/add-expense", obj, { headers: { "Authorization": token } })
            .then((response) => {
                console.log(response)
                showExpenses(response.data.expenseDetails)
            }).catch((err) => {
                console.log(err)
            })
    } catch (err) {
        console.log(err)
    }

}
function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
window.addEventListener("DOMContentLoaded", () => {
    const page=1;
   
    const token = localStorage.getItem('token')
    const decodedToken = parseJwt(token)
    console.log(decodedToken);
    const ispremiumuser= decodedToken.isPremium
    console.log(ispremiumuser)
    if(ispremiumuser){
        showPremiumUser();
         showLeaderboard();
    }
    axios.get(`http://localhost:3000/expense/get-expenses?page=${page}`, { headers: { "Authorization": token} })
        .then(response => {
            
            console.log(response.data);
            

            showExpenses(response.data.expenseDetails)
            showPagination(response.data);
            
           
            
        })
        .catch(err => console.log(err))


})

function showExpenses(expenseData) {
    
    const parentNode = document.querySelector('#add-expense');
     parentNode.innerHTML='<tr style="background:#04AA6D;color:white"><th>id</th><th>Amount</th><th>Description</th><th>Catagory</th><th>Delete/Edit</th></tr>';
     
    const itemsPerPage=localStorage.getItem('numberOfRows');

    
    expenseData.slice(0,itemsPerPage).forEach(expense=>{
        const parentNode = document.getElementById('add-expense');
        const childHTML = `<tr><th>${expense.id}</th><th>${expense.Expenseamount}</th><th>${expense.description}</th><th>${expense.catagory}</th><th> <button onclick=deleteExpense('${expense.id} style="background:#ed2f2f"')> Delete Expense</button>/<button onclick=editUser('${expense.Expenseamount}','${expense.description}','${expense.catagory}','${expense.id}')>Edit Expense </button></th></tr> `
    
        parentNode.innerHTML = parentNode.innerHTML + childHTML;  
    })



}


function deleteExpense(expenseId) {
    const token = localStorage.getItem('token')

    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: { "Authorization": token } })
        .then((response) => {
            removeUserFromScreen(expenseId);
        }).catch(err => console.log(err))
}

function removeUserFromScreen(expenseId) {
    const parentNode = document.getElementById('add-expense');
    const childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted)
    }
}

function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
    const pagination=document.getElementById('pagination');
    pagination.innerHTML=`Rows Per Page :<input type="number" id="quantity" name="quantity"  min="1" max="100" style="width:60px;height:30px" oninput="save()">`;
     document.getElementById('quantity').value= localStorage.getItem('numberOfRows')
    
    if(hasPreviousPage){
        const btn2=document.createElement('button')
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=>{
            getExpense(previousPage)
        })
        pagination.appendChild(btn2)
       }
       const btn1=document.createElement('button')
       btn1.innerhtml=currentPage
        btn1.addEventListener('click',()=>{
            getExpense(currentPage)
        })
        pagination.appendChild(btn1);
    
        if(hasNextPage){
            const btn3=document.createElement('button')
            btn3.innerHTML=nextPage
            btn3.addEventListener('click',()=>{
                getExpense(nextPage)
            })
            pagination.appendChild(btn3) 
        }
        if(lastPage!==currentPage && nextPage!== lastPage){
            const btn4=document.createElement('button')
            btn4.innerHTML=lastPage
            btn4.addEventListener('click',()=>{
                getExpense(lastPage)
            })
            pagination.appendChild(btn4)   
        }
    
     }
     function save() {
       
        var numRows = document.getElementById('quantity').value;
        localStorage.setItem('numberOfRows', numRows);
        
        }

   


     function getExpense(page){
        const token = localStorage.getItem('token')
        axios.get(`http://localhost:3000/expense/get-expenses?page=${page}`, { headers: { "Authorization": token } })
        .then((res)=>{
            showExpenses(res.data.expenseDetails);
            showPagination(res.data);
    
        }).catch(err=>{
            console.log(err)
        })
     }
    
    



function showPremiumUser(){
    document.getElementById('razorpay').style.visibility = "hidden";
            document.getElementById('premium').innerHTML = "You are Premium User"
}
function showLeaderboard(){
    const btn= document.createElement('button')
    btn.innerHTML="Leaderboard"
    document.getElementById('premium').appendChild(btn);
    btn.onclick = async (req,res)=>{
     const token = localStorage.getItem('token')
     const userLeaderboard= await axios.get('http://localhost:3000/premium/showLeaderboard',{headers:{ "Authorization": token }})
     console.log(userLeaderboard.data)

const leaderboardList=document.getElementById('leaderboard');
    leaderboardList.innerHTML=`<h3>Leader board</h3><tr style="background:#04AA6D;color:white"><th>user</th><th>total-expense</th></tr>`;
   userLeaderboard.data.forEach((userDetails)=>{
      leaderboardList.innerHTML +=`<table>

<tr>
<td>${userDetails.name}</td>
<td>${userDetails.total_expenses}</td>
</tr>

</table>`  
     })

    }

}
 function download(){
    const token = localStorage.getItem('token')

    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        console.log(response)
    if(response.status === 200){
        //the backend is sending a download link
        //  which if we open in browser, the file will get download
        var a = document.createElement("a");
      // a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
    } else {
        throw new Error(response.data.message)
    }
    
    })
    .catch((err) => {
    console.log(err)
    });
    }




document.getElementById('razorpay').onclick = async function (e) {
    const token = localStorage.getItem('token');
    
    const response = await axios.get('http://localhost:3000/purchase/purchaseMembership', { headers: { "Authorization": token } })
    console.log(response);
    var options = {
        "key_id": response.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
           const res= await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            alert('You are a Premium User Now')
            document.getElementById('razorpay').style.visibility = "hidden";
            document.getElementById('premium').innerHTML = "You are Premium User"
           
            localStorage.setItem('token',res.data.token)
            showLeaderboard();
       

      },
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went Wrong')
    })

}
