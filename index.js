const  GoogleSpreadsheet  = require ('google-spreadsheet')
const { promisify } = require ('util')

const credentials = require ('./credentials.json')

const docId = '193CaJoiEFEtU5VzK9-jWT_HobuwImr5NW2w4tHfQfes'




function mostrarAlunos (aluno){
  console.log(`Matricula: ${aluno.matricula}`)
  console.log(`Nome: ${aluno.aluno}`)
  console.log(`Resultado: ${aluno.situação}`)
  console.log(`Nota para aprovação: ${aluno.notaparaaprovaçãofinal}`)
  console.log('<---------------->')
}

async function accessSpreadsheets (){
  const doc = new GoogleSpreadsheet(docId)
  await promisify(doc.useServiceAccountAuth)(credentials)
  const info = await promisify(doc.getInfo)()
  const sheet = info.worksheets[0]
  
  const rows = await promisify(sheet.getRows)({
 
  })
  rows.forEach(row =>{
    mostrarAlunos(row)
    const alunos = {
      matricula: parseInt(row.matricula),
      name: row.aluno,
      notaTres: parseInt(row.p3),
      notaUm: parseInt(row.p1),
      notaDois: parseInt(row.p2),
      faltas: parseInt(row.faltas),
      resultado: row.situação,
      notaAprovacao: parseInt(row.notaparaaprovaçãofinal)
    }
   const media = 
   (alunos.notaUm + alunos.notaDois + alunos.notaTres) / 3;

   
     if (media >= 70){
      alunos.resultado = "Aprovado"
     }else if (media < 70 && media >= 50){
      alunos.resultado = "Exame Final"
     }else if (media < 50){
      alunos.resultado = "Reprovado por Nota"
     }

     alunos.notaAprovacao = parseInt(210 - (alunos.notaUm + alunos.notaDois + alunos.notaTres));
     if (alunos.notaAprovacao < 0){
       alunos.notaAprovacao = 0
     }

     if (alunos.faltas > 15){
       alunos.resultado = "Reprovado por faltas"
     }     
     console.log(alunos)
     for (i = 0; i < rows.length; i++){
       rows[i].situação = alunos.resultado
       rows[i].notaparaaprovaçãofinal = alunos.notaAprovacao
       
      }
      row.save();
    })
}


accessSpreadsheets();