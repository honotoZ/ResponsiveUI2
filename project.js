//fix design for form
//when click submit we shud get data in console

        const form=document.getElementById('formid')
        const fname=document.getElementById('fname')
        const lname=document.getElementById('lname')
        const tbody=document.getElementById('tbody')
        const url="https://66e9713e87e41760944971a4.mockapi.io/users"

        form.addEventListener('submit',(e)=>{
                e.preventDefault()
                const fname=document.getElementById('fname').value
                console.log(fname);
                const lname=document.getElementById('lname').value
                console.log(lname);
                // createTableRow(fname.value,lname.value)
                createUserData(fname,lname)
        })

        function createTableRow(id,value1,value2){
            const tr=document.createElement('tr')
            const td1=document.createElement('td')  // id
            const td2=document.createElement('td')  // first name
            const td3=document.createElement('td')  // last name
            const td4=document.createElement('td')  // Actions

            td1.setAttribute('scope','row')
            td2.setAttribute('id',`tableFname${id}`)    //Fname
            td3.setAttribute('id',`tableLname${id}`)    //Lname

            td1.innerHTML=id
            td2.innerHTML=value1
            td3.innerHTML=value2
            td4.innerHTML=`
            <button type="button" class="btn btn-primary" 
            data-bs-toggle="modal" 
            data-bs-target="#exampleModal${id}"
            id='edit${id}'
            onclick='getEditById(${id})'
            >Edit</button>
            <button class="btn btn-danger" 
            id='delete${id}' 
            onclick='deleteUserData(${id})'
            >Delete</button>`

            tbody.append(tr)
            tr.append(td1,td2,td3,td4)
            tr.style.textAlign='center'
            tr.style.height='50px'

            // for(let i=1;i<=tr.length;i++){
            //     if(i%2==0){
            //         tr.style.color='white'
            //         tr.style.backgroundColor='rgb(138, 138, 134)'
            //     }
            //     if(i%2!==0){
            //         tr.style.backgroundColor='none'
            //     }
            // }
        }

        async function getUserData(){
            let res=await fetch(url,{
                method:"GET"
            })
            let data=await res.json()
            console.log(data);
            data.map((element,index)=>{
                const{fname,lname,id}=element
                console.log(fname,lname,id);
                createTableRow(id,fname,lname);
            })
        }
        getUserData()

        async function createUserData(fname,lname){
            let newUser={
                fname:fname,
                lname:lname
            }
            let data=await fetch(url,{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(newUser)
            })
            let res=await data.json()
            console.log(res);
            createTableRow(res.id,res.fname,res.lname)
        }
        //EDIT
        //DELETE

        async function deleteUserData(id){
            console.log(id);
            console.log(`${url}/${id}`);
            await fetch(`${url}/${id}`,{
                method:"DELETE"
            })
            tbody.innerHTML=""
            getUserData()
        }

        async function getEditById(id){
            console.log(id);
            console.log(`${url}/${id}`)
            let data=await fetch(`${url}/${id}`,{
                method:"GET"
            })
            let res=await data.json()
            console.log(res);
            const{fname,lname}=res

            const modal=document.createElement('span')
            modal.innerHTML=`
            <div class="modal fade" id="exampleModal${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel${id}">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type='text' value=${fname} id="alertfname${id}">
                    <input type='text' value=${lname} id="alertlname${id}">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="updateUserData(${id})">Save changes</button>
                </div>
                </div>
            </div>
            `
            document.body.append(modal)
        }

        async function updateUserData(id){
            modalFname=document.getElementById(`alertfname${id}`).value
            modalLname=document.getElementById(`alertlname${id}`).value
            console.log(modalFname,modalLname);
            console.log(id);
            
            let updateUser={
                fname:modalFname,
                lname:modalLname
            }
            let data=await fetch(`${url}/${id}`,{
                method:"PUT",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(updateUser)
            })
            let res=await data.json()
            console.log(res);

            document.getElementById(`tableFname${id}`).innerText=res.fname
            document.getElementById(`tableLname${id}`).innerText=res.lname
        }