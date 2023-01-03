
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
    const token = localStorage.getItem('token')
    const decodedToken = parseJwt(token)
    console.log(decodedToken);
    const ispremiumuser= decodedToken.isPremium
    console.log(ispremiumuser)
    if(ispremiumuser){
        showPremiumUser();
         showLeaderboard();
    }
    axios.get("http://localhost:3000/expense/get-expenses", { headers: { "Authorization": token } })
        .then(response => {

            console.log(response);
            for (var i = 0; i < response.data.expenseDetails.length; i++) {
                showExpenses(response.data.expenseDetails[i]);
            }
        })
        .catch(err => console.log(err))


})

function showExpenses(expense) {
    document.getElementById('expense').value = '';
    document.getElementById('description').value = '';
    document.getElementById('catagory').value = '';


    const parentNode = document.getElementById('add-expense');
    const childHTML = `<li id=${expense.id}> ${expense.Expenseamount} : ${expense.description}:${expense.catagory}
                                <button onclick=deleteExpense('${expense.id}')> Delete Expense</button>
 <button onclick=editUser('${expense.Expenseamount}','${expense.description}','${expense.catagory}','${expense.id}')>Edit Expense </button>
                             </li>`

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
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
    leaderboardList.innerHTML="<h3>Leader board</h3><tr><th>user</th><th>total-expense</th></tr>";
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
