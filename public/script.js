/* firebase */
const firebaseConfig = {
    apiKey: "AIzaSyAhAbimlqdskKgJsA3xsyZSN6Uor6imAuw",
    authDomain: "atharmnalquraan.firebaseapp.com",
    databaseURL: "https://atharmnalquraan-default-rtdb.firebaseio.com",
    projectId: "atharmnalquraan",
    storageBucket: "atharmnalquraan.appspot.com",
    messagingSenderId: "116533957606",
    appId: "1:116533957606:web:64541299c99b57dcd57c27",
    measurementId: "G-E3FSEDZF2V"
};
firebase.initializeApp(firebaseConfig);

const atharDB = firebase.database().ref('atharmnalquraan');

const db = firebase.firestore();

document.getElementById('athar-form').addEventListener('submit', submitAthar);

function submitAthar(e) {
    let msgerror = document.getElementById("msg-error");
    let msgsuccess = document.getElementById("msg-success");
    e.preventDefault();
    let ayah = document.forms['athar-form']['ayah-entered'].value;
    let athar = document.forms['athar-form']['athar-entered'].value;
    let num = document.forms['athar-form']['num-entered'].value;
    let name = document.forms['athar-form']['name-entered'].value;
    if (ayah == '' || ayah.length < 5) {
        msgerror.textContent = 'الرجاء ادخال الاية التي اثرت بك';
        setTimeout(() => {
            msgerror.textContent = '';
        }, 5000);
        return
    }
    console.log(ayah, name, num, athar);
    saveAthar(ayah, name, num, athar);

    msgsuccess.style.display='flex';
    setTimeout(() => {
        document.forms['athar-form']['ayah-entered'].value='';
        document.forms['athar-form']['athar-entered'].value='';
        document.forms['athar-form']['num-entered'].value='';
        document.forms['athar-form']['name-entered'].value='';
        msgsuccess.style.display='none';
        show('read');
    }, 3000);


}
function saveAthar(ayah, name, num, athar) {
    db.collection('Athar').doc().set({
        ayah: ayah,
        name: name,
        num: num,
        athar: athar,
    }).then(() => {
        console.log('written successfully');
    }).catch((error) => {
        console.log('error:', error);
    });
}
var windowList;
window.onload=async ()=>{
    windowList= await read();
    console.log(windowList)
}
async function read() {
    var list = [];
    try {
        await db.collection('Athar')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    list.push({ 'ayah': doc.data()['ayah'], 'name': doc.data()['name'], 'num': doc.data()['num'], 'athar': doc.data()['athar'] });
                });
            })
    }
    catch (error) {
        console.log('error:', error);
    };
    return list;
}

async function display() {
    var ayah = document.getElementById("Ayah-displayed");
    var athar = document.getElementById("Athar-displayed");
    var name = document.getElementById("name-displayed");
    var num = document.getElementById("num-displayed");
    var atharText = document.getElementById("athar-text");
    var info = document.getElementById("info-displayed");

    var i = Math.floor(Math.random() * windowList.length);
    console.log(windowList[i])
    ayah.textContent = windowList[i]['ayah'];
    if (windowList[i]['athar'] != '') {
        athar.textContent = windowList[i]['athar'];
        atharText.style.display = 'block';
    }
    else{
        atharText.style.display = 'none';
        athar.textContent = '';
    }
    if (windowList[i]['name'] != '' && windowList[i]['num'] != '') {
        name.textContent = windowList[i]['name'];
        num.textContent = windowList[i]['num'];
        info.style.display = 'block';
    }
    else{
        info.style.display = 'none';
    }
}

async function show(type) {
    var userChoice = document.getElementById("user-choice");
    var userWriting = document.getElementById("user-writing");
    var userReading = document.getElementById("user-reading");
    if (type == 'write') {
        userChoice.style.display = "none";
        userWriting.style.display = "flex";
        userReading.style.display = "none";
        return;
    }
    else if (type == 'read') {
        await display();
        userChoice.style.display = "none";
        userWriting.style.display = "none";
        userReading.style.display = "flex";
        return;
    }
    return;
}

