const cadastroAlunoForm = document.getElementById('cadastroAlunoForm');
const envioAtividadeForm = document.getElementById('envioAtividadeForm');
const alunoSelect = document.getElementById('alunoSelect');
const listaAtividades = document.getElementById('listaAtividades');

function salvarAlunos(alunos) {
  localStorage.setItem('alunos', JSON.stringify(alunos));
}

function carregarAlunos() {
  return JSON.parse(localStorage.getItem('alunos')) || [];
}

function atualizarSelectAlunos() {
  const alunos = carregarAlunos();
  alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
  alunos.forEach((aluno, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });
}

function salvarAtividades(atividades) {
  localStorage.setItem('atividades', JSON.stringify(atividades));
}

function carregarAtividades() {
  return JSON.parse(localStorage.getItem('atividades')) || [];
}

function exibirMensagem(mensagem, tipo) {
  const mensagemDiv = document.createElement('div');
  mensagemDiv.className = `mensagem ${tipo}`;
  mensagemDiv.textContent = mensagem;
  document.body.appendChild(mensagemDiv);
  setTimeout(() => {
    mensagemDiv.remove();
  }, 3000);
}

function carregarAtividadesNaTela() {
  listaAtividades.innerHTML = '';
  const atividades = carregarAtividades();
  const alunos = carregarAlunos();

  atividades.forEach((atividade) => {
    const li = document.createElement('li');

    const aluno = alunos[atividade.alunoIndex];
    const nomeAluno = aluno ? aluno.nome : 'Aluno removido';

    const dataEnvio = new Date(atividade.dataEnvio);
    const dataFormatada = dataEnvio.toLocaleDateString('pt-BR');
    const horaFormatada = dataEnvio.toLocaleTimeString('pt-BR');

    li.innerHTML = `
      <strong>${atividade.titulo}</strong><br/>
      <small>Aluno: ${nomeAluno}</small><br/>
      <p>${atividade.descricao}</p>
      <div class="dataAtividade">Enviado em ${dataFormatada} às ${horaFormatada}</div>
    `;
    listaAtividades.appendChild(li);
  });
}

cadastroAlunoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nomeAluno = cadastroAlunoForm.nomeAluno.value.trim();
  const emailAluno = cadastroAlunoForm.emailAluno.value.trim();

  if (!nomeAluno || !emailAluno) {
    exibirMensagem('Por favor, preencha todos os campos.', 'erro');
    return;
  }

  let alunos = carregarAlunos();

  const emailExistente = alunos.some(aluno => aluno.email === emailAluno);
  if (emailExistente) {
    exibirMensagem('Este e-mail já está cadastrado.', 'erro');
    return;
  }

  alunos.push({ nome: nomeAluno, email: emailAluno });
  salvarAlunos(alunos);
  atualizarSelectAlunos();
  cadastroAlunoForm.reset();
  exibirMensagem('Aluno cadastrado com sucesso!', 'sucesso');
});

envioAtividadeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const alunoIndex = envioAtividadeForm.alunoSelect.value;
  const titulo = envioAtividadeForm.tituloAtividade.value.trim();
  const descricao = envioAtividadeForm.descricaoAtividade.value.trim();

  if (alunoIndex === '' || !titulo || !descricao) {
    exibirMensagem('Preencha todos os campos para enviar a atividade.', 'erro');
    return;
  }

  let atividades = carregarAtividades();
  atividades.push({
    alunoIndex: parseInt(alunoIndex),
    titulo,
    descricao,
    dataEnvio: new Date().toISOString()
  });

  salvarAtividades(atividades);
  envioAtividadeForm.reset();
  carregarAtividadesNaTela();
  exibirMensagem('Atividade enviada com sucesso!', 'sucesso');
});

// Inicializações
atualizarSelectAlunos();
carregarAtividadesNaTela();



