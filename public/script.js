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

    msgsuccess.style.display = 'flex';
    setTimeout(() => {
        document.forms['athar-form']['ayah-entered'].value = '';
        document.forms['athar-form']['athar-entered'].value = '';
        document.forms['athar-form']['num-entered'].value = '';
        document.forms['athar-form']['name-entered'].value = '';
        msgsuccess.style.display = 'none';
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
window.onload = async () => {
    windowList = await read();
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
    else {
        atharText.style.display = 'none';
        athar.textContent = '';
    }
    if (windowList[i]['name'] != '' && windowList[i]['num'] != '') {
        name.textContent = windowList[i]['name'];
        num.textContent = windowList[i]['num'];
        info.style.display = 'block';
    }
    else {
        info.style.display = 'none';
    }
}

async function show(type) {
    var userChoice = document.getElementById("user-choice");
    var userWriting = document.getElementById("user-writing");
    var userReading = document.getElementById("user-reading");
    var readinglist = document.getElementById("reading-list");
    if (type == 'write') {
        userChoice.style.display = "none";
        userWriting.style.display = "flex";
        userReading.style.display = "none";
        readinglist.style.display = "none";
        return;
    }
    else if (type == 'read') {
        await display();
        userChoice.style.display = "none";
        userWriting.style.display = "none";
        userReading.style.display = "flex";
        readinglist.style.display = "none";
        return;
    }
    else if (type == 'list') {
        entry=0;
        createAtharcards(true);
        userChoice.style.display = "none";
        userWriting.style.display = "none";
        userReading.style.display = "none";
        readinglist.style.display = "flex";
        return;
    }
    return;
}
var entry = 0;//-----------------------
function createAtharcards(isAdd) {
    if (windowList != null) {
        if (entry < windowList.length && isAdd) {
            //cleaning list div to add the other
            cleanList();

            var x = windowList.length - entry;
            var y = 5;
            if (x < y) {
                y = x;
            }

            for (var i = 0; i < y; i++) {
                makeCard();
                entry++;
            }
        }

        else if(entry>5 && (!(isAdd))){
            cleanList();
            var x = entry%5;
            var y = 10;
            if (x != 0) {
                y = 5+x;
            }
            entry-=y;

            for (var i = 0; i < 5; i++) {
                makeCard();
                entry++;
            }
        }

        document.getElementById("endnum").textContent = windowList.length;
        document.getElementById("startnum").textContent = entry;
    }
}

function makeCard() {
    var a = document.createElement("h5");
    a.setAttribute("class", "text");
    a.textContent = ':قوله تعالى';

    var b = document.createElement("div");
    b.setAttribute("class", "textSize");
    b.appendChild(a);

    var c = document.createElement("h5");
    c.setAttribute("class", "text");
    c.textContent = windowList[entry]['ayah'];

    var d = document.createElement("div");
    d.setAttribute("class", "row justified");
    d.appendChild(c);
    d.appendChild(b);

    var e = document.createElement("h5");
    e.setAttribute("class", "text");
    e.textContent = 'سورة: ' + windowList[entry]['name'] + " ,رقم الايه: " + windowList[entry]['num'];

    var h = document.createElement("div");
    h.setAttribute("class", "row justified");
    if (windowList[entry]['athar'] != '') {
        var f = document.createElement("h5");
        f.setAttribute("class", "athar-text");
        f.textContent = ':الأثر';

        var g = document.createElement("h5");
        g.setAttribute("class", "athar-text");
        g.textContent = windowList[entry]['athar'];

        h.appendChild(g);
        h.appendChild(f);
    }

    var card = document.createElement("div");
    card.setAttribute("class", "card");
    card.appendChild(d);
    card.appendChild(e);
    card.appendChild(h);
    document.getElementById("list").appendChild(card);
}

function cleanList() {
    const list = document.getElementById("list");
    if (list.hasChildNodes()) {
        for (var i = list.children.length-1; i > -1; i--) {
            console.log(list.children.length)
            list.removeChild(list.children[i]);
        }
    }
}
