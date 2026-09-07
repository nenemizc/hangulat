import './style.css'
import type { Hangulat, NewHangulat } from './Hangulat';
import 'bootstrap/dist/css/bootstrap.css';

const url = 'https://retoolapi.dev/cMkJXs/data';

async function loadData(){
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Invalid response');
  }
  const data = await response.json() as Hangulat[];

  const content = document.getElementById('tableBody');
  content!.textContent = '';
  for (const m of data) {
    const tr = document.createElement('tr');

    const date = document.createElement('td');
    date.textContent = m.date;
    tr.appendChild(date);

    const mood = document.createElement('td');
    mood.textContent = m.mood;
    tr.appendChild(mood);

    const desc = document.createElement('td');
    desc.textContent = m.desc;
    tr.appendChild(desc);

    const deelete = document.createElement('td');
    const delButton = document.createElement('button');
    delButton.textContent = '❌';
    delButton.classList.add('btn')
    delButton.addEventListener('click', async () => {
      await fetch(`${url}/${m.id}`, {
        method: 'DELETE'
      });
      loadData();
    });
    deelete.append(delButton);
    tr.appendChild(deelete);

    content?.appendChild(tr);
  }

}

async function newData(e: SubmitEvent){
  e.preventDefault();
  const dataform = document.getElementById('form') as HTMLFormElement;
  const data = new FormData(dataform);

  const newData: NewHangulat = {
    date: new Date().toString(),
    desc: data.get('desc')!.toString(),
    mood: data.get('mood')!.toString()
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(newData),
    headers: {
      'Content-type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Invalid response');
  }

  dataform.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('form')?.addEventListener('submit',newData);
});