Gerenciamento de Produtos – AgilStore

## 📌 Visão Geral

Este projeto é uma aplicação em Node.js desenvolvida para gerenciar o inventário da loja AgilStore, permitindo adicionar, listar, atualizar, excluir e buscar produtos via terminal.

A aplicação foi criada para atender ao enunciado proposto, automatizando o controle de estoque que antes era feito manualmente.

---

## ⚙️ Tecnologias Utilizadas

* Node.js(v22.12.0)
* JavaScript
* Módulos nativos:

  * `fs` (manipulação de arquivos)
  * `readline/promises` (entrada de dados no terminal)

---

## ▶️ Como Executar o Projeto

node ex_01.js

O sistema funciona totalmente via terminal, utilizando menus interativos.

---

## 🗂 Estrutura de Dados

Os produtos são armazenados no arquivo `produtos.json`, garantindo persistência de dados.

Cada produto possui a seguinte estrutura:
  {
        id
        Produto
        Categoria
        Quantidade
        Preco
  }


## 🧠 Funções Auxiliares

### `centralizar(texto, largura)`

Centraliza um texto dentro de uma largura fixa, utilizada para formatar menus e tabelas no terminal.

**Como funciona:**

* Converte o texto para string
* Calcula os espaços necessários à esquerda e à direita
* Retorna o texto centralizado

---

### `arrumar_opcoes(texto)`

Formata opções de menu alinhadas à esquerda.

---

### `sleep(segundos)`

Cria um pequeno atraso na execução do código.

---

## 📋 Funcionalidades Principais

### 1️⃣ Adicionar Produto

Função responsável por cadastrar um novo produto.

<img width="1080" height="436" alt="image" src="https://github.com/user-attachments/assets/75003b3c-1ddf-4762-9214-218d51e69353" />

**Etapas executadas:**

* Solicita nome, categoria, estoque e preço
* Valida os dados numéricos
* Gera um **ID único automaticamente**
* Salva o produto no arquivo `produtos.json`

---

### 2️⃣ Listar Produtos

Exibe todos os produtos cadastrados em formato de tabela.

**Informações exibidas:**

<img width="1082" height="248" alt="image" src="https://github.com/user-attachments/assets/447fbaef-f740-4b63-aecb-1c6b51d9f36c" />

* ID
* Nome
* Categoria
* Quantidade em estoque
* Preço

---

### 3️⃣ Atualizar Produto

Permite alterar dados de um produto existente.

<img width="1090" height="150" alt="image" src="https://github.com/user-attachments/assets/6297db98-72db-473d-af97-30f63accedbe" />

<img width="1078" height="326" alt="image" src="https://github.com/user-attachments/assets/72cff86d-06e1-4f20-a009-22162e9e0f46" />

**Funcionamento:**

* Solicita o ID do produto
* Verifica se o produto existe
* Exibe um menu para escolher qual campo atualizar
* Valida os novos dados
* Salva as alterações no arquivo

---

### 4️⃣ Excluir Produto

Remove um produto do inventário.

<img width="1120" height="311" alt="image" src="https://github.com/user-attachments/assets/39e509c8-a2c2-4af3-bd6f-9965b14f559b" />

**Processo:**

* Solicita o ID do produto
* Verifica se o ID existe
* Pede confirmação do usuário
* Remove o produto do array
* Atualiza o arquivo JSON

✔️ Atende ao requisito *Excluir Produto*

---

### 5️⃣ Buscar Produto

<img width="1091" height="329" alt="image" src="https://github.com/user-attachments/assets/74257e3c-a673-409c-9c1a-f5a90c181b36" />

Permite buscar produtos por **ID** ou **nome** (ou parte do nome).

**Comportamento:**

* Realiza busca no array de produtos
* Exibe todos os dados do produto encontrado
* Mostra mensagem apropriada caso não encontre resultados

---

## 💾 Persistência de Dados

O sistema utiliza o arquivo **`produtos.json`** para salvar automaticamente todas as alterações.

✔️ Atende ao requisito extra de persistência

---

## 🧭 Função `main()`

Função principal da aplicação.

**Responsabilidades:**

* Exibir o menu principal
* Capturar a opção escolhida
* Direcionar para a função correspondente
* Manter o sistema em execução até o usuário escolher sair

---

## ✅ Conclusão

Este projeto cumpre todos os requisitos funcionais propostos no enunciado, utilizando boas práticas de organização, validação de dados e persistência em arquivo.

A interface em terminal foi aprimorada com funções auxiliares para melhor usabilidade e clareza visual.

---
