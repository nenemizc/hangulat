import './style.css'
import type { Hangulat, NewHangulat } from './Hangulat';
import 'bootstrap/dist/css/bootstrap.css';

const url = 'https://retoolapi.dev/cMkJXs/data';

async function loadData(){
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load data');
  }
  const data = await response.json() as Hangulat[];

  const content = document.getElementById('tableBody');
  content!.textContent = '';

  for (const m of data) {
    const tr = document.createElement('tr');

    const dateTd = document.createElement('td');
    dateTd.textContent = m.date;
    tr.appendChild(dateTd);

    const moodTd = document.createElement('td');
    moodTd.textContent = m.mood;
    tr.appendChild(moodTd);

    const descTd = document.createElement('td');
    descTd.textContent = m.desc;
    tr.appendChild(descTd);

    const actionsTd = document.createElement('td');

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('btn', 'btn-warning', 'me-2');

    const delButton = document.createElement('button');
    delButton.textContent = '🗑️';
    delButton.classList.add('btn', 'btn-danger');

    delButton.addEventListener('click', async () => {
      if (window.confirm('Biztosan törli ezt a bejegyzést?')){
        await fetch(`${url}/${m.id}`, {
        method: 'DELETE'
      });
      loadData();
      }
    });

    editButton.addEventListener('click', () => {
      dateTd.textContent = '';
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.classList.add('form-control');
      dateInput.value = m.date;
      dateTd.appendChild(dateInput);

      moodTd.textContent = '';
      const moodSelect = document.createElement('select');
      moodSelect.classList.add('form-select');
      
      const options = ['😀','😐','😢','😴','😡'];
      options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === m.mood) option.selected = true;
        moodSelect.appendChild(option);
      });
      moodTd.appendChild(moodSelect);

      descTd.textContent = '';
      const descInput = document.createElement('input');
      descInput.type = 'text';
      descInput.classList.add('form-control');
      descInput.value = m.desc;
      descTd.appendChild(descInput);

      actionsTd.textContent = '';

      const finalizeButton = document.createElement('button');
      finalizeButton.textContent = '✔️';
      finalizeButton.classList.add('btn', 'btn-success', 'me-2');

      const cancelButton = document.createElement('button');
      cancelButton.textContent = '❌';
      cancelButton.classList.add('btn', 'btn-secondary');

      finalizeButton.addEventListener('click', async () => {
        const updatedData: NewHangulat = {
          date: dateInput.value,
          mood: moodSelect.value,
          desc: descInput.value
        };

        const editResponse = await fetch(`${url}/${m.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        });

        if (!editResponse.ok) {
          alert('Failed to update record');
          return;
        }

        loadData();
      });

      cancelButton.addEventListener('click', () => {
        loadData();
      });

      actionsTd.appendChild(finalizeButton);
      actionsTd.appendChild(cancelButton);
    });

    actionsTd.appendChild(editButton);
    actionsTd.appendChild(delButton);
    tr.appendChild(actionsTd);

    content?.appendChild(tr);
  }
}

async function newData(e: SubmitEvent){
  e.preventDefault();
  const dataform = document.getElementById('form') as HTMLFormElement;
  const data = new FormData(dataform);

  if(document.getElementById('tableBody') == null){
    const newData: NewHangulat = {
      date: new Date().toISOString().split('T')[0],
      desc: data.get('desc')!.toString(),
      mood: data.get('mood')!.toString()
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(newData),
      headers: {
        'Content-type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit new record');
    }
  
  }
  else{
    const newData: NewHangulat = {
      date: data.get('date')!.toString(),
      desc: data.get('desc')!.toString(),
      mood: data.get('mood')!.toString()
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(newData),
      headers: {
        'Content-type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit new record');
    }
  }
  dataform.reset();
  loadData();

}

async function countData(){
  

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load data');
  }
  const data = await response.json() as Hangulat[];

  let mood0=0;
  let mood1=0;
  let mood2=0;
  let mood3=0;
  let mood4=0;

  for (const i of data){
    switch(i.mood){
      case '😀':
        mood0++;break;
      case '😐':
        mood1++;break;
      case '😢':
        mood2++;break;
      case '😴':
        mood3++;break;
      case '😡':
        mood4++;break;
    }
  }
  
  if (document.getElementById('0') != null){
    document.getElementById('0')!.textContent=mood0.toString();
    document.getElementById('1')!.textContent=mood1.toString();
    document.getElementById('2')!.textContent=mood2.toString();
    document.getElementById('3')!.textContent=mood3.toString();
    document.getElementById('4')!.textContent=mood4.toString();  
  }

}

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('tableBody') != null){
    loadData();
  }
  document.getElementById('form')?.addEventListener('submit', newData);
  countData();
});