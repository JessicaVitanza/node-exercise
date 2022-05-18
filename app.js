const fs = require('fs');
const model = require('./model.js');
const prompt = require('prompt');
const { log } = require('console');


const studentArray = tryToLoadData()

console.log('benvenuti nel sito della scuola!')

startMenu();

prompt.start()



function startMenu(){

  console.log('Sono disponibili 5 opzioni:');
  console.log('1) Visualizza studenti');
  console.log('2) Inserisci studente');
  console.log('3) Cerca studente'); 
  console.log('4) Elimina studente');
  console.log('5) Esci');
  console.log('6) aggiorna studente'); 

  const schema = {
    properties:{
      selection: {
        description: 'seleziona una delle opzioni'
      }
    }
  }
  prompt.get(schema, startMenuDone);
}



function startMenuDone(err, res){
  switch (res.selection) {
    case '1':
      visulizeStudents(studentArray);
      startMenu();
      break;
    case '2':
      insertStudent();
      break;
    case '3':
      searchStudent();
      break;
    case '4':
      removeStudent();
      break;
    case '5':
      console.log('Arrivederci!')
      process.exit(); 
      case '6':
        updateStudent();
        break;
    default:
      console.log('opzione non valida');
      startMenu();
      break;
  }
}



function insertStudent(){

  const schema = {
    properties: {
      name:{
        description: 'inserisci il nome'
      },
      surname:{
        description: 'inserire il cognome'
      },
      gender:{
        description: 'inserire il genere ("m" => maschile, "f" => femminile, "n" => non definito)'
      },
      yob:{
        description: 'inserire l\'anno di nascita'
      }
    }
  }
  prompt.get(schema, insertStudentDone);
}



function insertStudentDone(err, res){
  let gender;
  if (res.gender === 'm') {
    gender = model.Student.GENDER.male;
  } else if (res.gender === 'f'){
    gender = model.Student.GENDER.female;
  } else {
    gender = model.Student.GENDER.undefined;
  }

  const student = new model.Student(res.name, res.surname, gender, parseInt(res.yob));

  studentArray.push(student);

  tryToSaveData()

  startMenu();
}


function searchStudent(){
    const schema = {
      properties: {
        searchWord: {
           description: 'Inserire la parola da cercare'
           }
        }
    }
    prompt.get(schema, executeSearch);
}



function executeSearch(error, result) {
    const tempArray = [];
    for (const student of studentArray) {
      const foundInName = studet.name.toLowerCase().includes(result.searchWord.toLowerCase());
      const foundInSurname =  student.surname.toLowerCase().includes(result.searchWord.toLowerCase());

      if (foundInName || foundInSurname) {
        tempArray.push(student);
      }  
    }
    //const tempArray = studentArray.filter(filterFunction);

    visulizeStudents(tempArray);
    startMenu();
}



// function filterFunction(student) {
//     const foundInName = studet.name.toLowerCase().includes(result.searchWord.toLowerCase());
//     const foundInSurname =  student.surname.toLowerCase().includes(result.searchWord.toLowerCase());
//     return foundInName || foundInSurname;
// }



function removeStudent() {
  console.log("Ecco gli studenti attualmente registrati:");
  visulizeStudents(studentArray);

  const schema = {
    properties: {
      selectedIndex: {
        description: 'Inserisci il numero dello studente da eliminare'
      }
    }
  }
  prompt.get(schema, executeRemoveStudent);
}



function executeRemoveStudent(error, result) {
  const humanIndex = parseInt(result.selectedIndex);
  
  if (humanIndex === NaN) {
      startMenu();
      return;
  }

  const index = humanIndex - 1;

  const isInArray = index >= 0 && index <= studentArray.length;

  if (isInArray) {
    studentArray.splice(index,1);
    tryToSaveData();
    startMenu();
  } else {
    console.log('Indice non trovato');
    startMenu();
  }
}

function updateStudent() {
    console.log("Ecco gli studenti attualmente registrati:");
    visulizeStudents(studentArray);
  
    const schema = {
      properties: {
        selectedIndex: {
          description: 'Inserisci il numero dello studente da modificare'
        },
        selectedName: {
            description: 'Inserisci il nome dello studente da modificare'
          }, 
        selectedSurname: {
            description: 'Inserisci il cognome dello studente da modificare'
        },  
        selectedGender: {
            description: 'Inserisci il gender dello studente da modificare'
        },  
        selectedYob: {
            description: 'Inserisci il yob dello studente da modificare'
        },  
      }
    }
    prompt.get(schema, executeUpdateStudent);
  } 

  function executeUpdateStudent(error, result) {
    const humanIndex = parseInt(result.selectedIndex);
    
    if (humanIndex === NaN) {
        startMenu();
        return;
    }
  
    const index = humanIndex - 1;
  
    const isInArray = index >= 0 && index <= studentArray.length;
  
    if (isInArray) { 
      studentArray[index].name = result.selectedName;
      tryToSaveData();
    } else {
      console.log('Indice non trovato');
      startMenu();
    }
  }
  

function visulizeStudents(arrayToVisulize){
  for (let i = 0; i < arrayToVisulize.length; i++) {
      const student = arrayToVisulize[i];
      const humanIndex = i + 1;

      console.log(humanIndex + ') ' + student.toString());
      console.log('------------------------');
  }

//   for (const student of arrayToVisulize) {
//     console.log(student.toString());
//     console.log('------------------------');
//   }

}



function tryToLoadData(){
  
  let array;
  try {
    const jsonArray = fs.readFileSync('./student-data.json', 'utf8');
    array = JSON.parse(jsonArray)
  } catch (err) {
    array = [];
  }

  const studArray = []
  for (const obj of array) {
    const student = model.Student.createStudentFromOBject(obj)
    studArray.push(student);
  }
  return studArray;
}



function tryToSaveData(){

  const jsonArray = JSON.stringify(studentArray);
  try {
    fs.writeFileSync('./student-data.json', jsonArray);
  } catch (error) {
    console.log('errore nel salvataggio');
  }
}




