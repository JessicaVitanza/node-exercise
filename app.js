const fs = require('fs');
const model = require('./model.js');
const prompt = require('prompt');




const studentArray = tryToLoadData()

console.log('benvenuti nel sito della scuola!')

startMenu();

function startMenu(){

  console.log('Sono disponibili 5 opzioni:');
  console.log('1) Visualizza studenti');
  console.log('2) Inserisci studente');
  console.log('3) Cerca studente');
  console.log('4) Elimina studente');
  console.log('5) Esci');

  prompt.start()

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
      visulizeAllStudents()
      break;
    case '2':
      insertStudent()
      break;
    case '3':
      searchStudent()
      break;
    case '4':
      removeStudent()
      break;
    case '5':
      console.log('ciao ciao')
      process.exit();
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


function visulizeAllStudents(){
  for (const student of studentArray) {
    console.log(student.toString());
    console.log('------------------------')
  }

  startMenu();
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
