const url = 'https://964d7v9n.ap-southeast.insforge.app/rest/v1/murid?select=*';
const key = 'ik_08b67cd9589270f7e6f85751e8f4e0d5';

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key
  }
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
