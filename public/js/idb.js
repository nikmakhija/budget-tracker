let db;
const request = indexedDB.open('budget_tracker', 1);

request.ongradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', {autoIncrement: true});
};

request.onupgradeneeded = ({ target }) => {
    let db = target.result;

    db.createObjectStore("pending",
    { autoIncrement: true });
};

request.onsuccess = 
({ target }) => {
    db =target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror =
function(event) {
    console.log("Error " + event.target.ErrorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');

const Store = transaction.objectStore('pending');

Store.add(record);
}

function checkDatabase() {
    const transaction =
    db.transaction(["pending"],
    "readwrite");
    const store =
    transaction.objectStore("pending");
    const getAll =
    store.getAll();
 
     getAll.onsuccess = function () 
     {
         if (getAll.result.length >
            0) {
                fetch("/api/transaction/bulk", {
                    method: "POST" ,
                    body:
                    json.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type":
                        "application/json"
                    }
                })
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    const transaction =
                    db.transaction(["pending"],
                    "readwrite");
                    const store =
                    transaction.objectStore("pending");
                    store.clear();
                });
            }    
        };
            }
        
    window.addEventListener("online", checkDatabase);

