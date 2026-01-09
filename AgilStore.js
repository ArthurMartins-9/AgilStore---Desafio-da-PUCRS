//Const globais
const readline = require('readline/promises')
const fs = require('fs')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const larguraTotal = 90
const largura_interior = larguraTotal - 2
const tamanho = 10
const pergunta = "|-->"
const piso = "+" + "=".repeat(largura_interior) + "+\n"
const piso_pergunta = "+" + "=".repeat(largura_interior) + "+\n"+"|-->"
//funções q vão ser usada no programa inteiro
function sleep(segundos){
    return new Promise(resolve=>setTimeout(resolve,segundos*1000))
}
function ler_arquivo(){
   if(!fs.existsSync('./produtos.json')){
    fs.writeFileSync('./produtos.json',
        JSON.stringify({
            total_produtos: 0,
            proximoid: 1,
            produtos: []
        },null,1)
    )
   }
   return JSON.parse(fs.readFileSync('./produtos.json','utf8'))
}
function texto_de_input(texto) {
    console.clear()
    console.log("+" + "=".repeat(largura_interior) + "+")
    console.log("|" + " ".repeat(Math.floor((larguraTotal - texto.length - 2) / 2)) + `${texto}` + " ".repeat(larguraTotal - texto.length - 2 -Math.floor((larguraTotal - texto.length - 2) / 2)) + "|")
    console.log("+" + "=".repeat(largura_interior) + "+");
}
function tela_de_inicio() {
    const texto = "Inventario do AgilStore"
    console.clear()
    console.log("+" + "=".repeat(largura_interior) + "+")
    console.log("|" + " ".repeat((larguraTotal - texto.length) / 2) + `${texto}` + " ".repeat(Math.abs(texto.length - larguraTotal / 2 - 10)) + "|")
    console.log("+" + "=".repeat(largura_interior) + "+");
    for (let i = 0; i < tamanho; i++) {
        console.log("|" + " ".repeat(largura_interior) + "|")
    }
}
function centralizar(texto,largura) {
    texto = String(texto)
    if (texto.length > largura) {
        texto = texto.slice(0, largura);
    }
    const espacos = largura - texto.length;
    const esquerda = Math.floor(espacos / 2);
    const direita = espacos - esquerda;
    
    return " ".repeat(esquerda) + texto + " ".repeat(direita);
}
function imprime_produto(produto){
    
    console.log("|" + centralizar("ID: "+produto.id,14) + "|" + centralizar("NOME: "+produto.Produto, 33) + "|" + centralizar("CATEGORIA: "+produto.Categoria, 39) + "|\n|" + centralizar(`ESTOQUE: ${produto.Quantidade}`, 35) + "|" + centralizar("PRECO(R$): "+produto.Preco, 52) + "|");
}
function arrumar_opcoes(texto){
    texto = String(texto)
    return "|"+texto+" ".repeat(largura_interior - texto.length)+"|\n"
}
function listar_produto(dados){
    texto_de_input("ID  |     NOME DO PRODUTO     |       CATEGORIA         |  QUANTIDADE  |  PRECO(R$)")
    dados.forEach(produto => {
        console.log("|"+centralizar(produto.id,6)+"|" + centralizar(produto.Produto, 25) + "|" + centralizar(produto.Categoria, 25) + "|" + centralizar(produto.Quantidade, 14) + "|" + centralizar(produto.Preco, 14) + "|")
    })
}
//Async , ou seja , um codigo q faz toda função uma por uma , logo agente consegue utilizar o await para funcionar as nossas perguntas
//Precisa ser assim pro await funcionar

//Modificar Inventário e suas funções 
async function Modificar_Inventario() {
    do {
        tela_de_inicio()
        const opcao = await rl.question(arrumar_opcoes("Qual a sua escolha:") +arrumar_opcoes("1)Adicionar um novo produto")+ arrumar_opcoes("2)Modificar um produto existente no inventário")+arrumar_opcoes("3)Apagar itens do inventário") +arrumar_opcoes("0)Voltar pro menu") +piso_pergunta)
        
        switch (Number(opcao)) {
            case 1:
                await cadastramento_de_produto()
                break;
            case 2:
                await Atualizacao_do_Produto()
                break;
            case 3:
                await apagar_produto()
                break
            case 0:
                return
            default:
                console.log(arrumar_opcoes("Escolha inválida favor escolher uma opção possível"))
                await sleep(1)
        }
    } while (true);
}

async function cadastramento_de_produto(){
    
    await texto_de_input("Cadastro do Inventario da AgilStore")

    const Nome_do_Produto= await rl.question(arrumar_opcoes("Produto:")+pergunta)
    const Categoria_Do_Produto= await rl.question(arrumar_opcoes("Categoria:")+pergunta)
    const Estoque= await rl.question(arrumar_opcoes("Estoque:")+pergunta)
    const estoque_num = Number(Estoque)
    if(Number.isNaN(estoque_num)|| Number(Estoque) < 0){
        console.log(arrumar_opcoes("Cadastro de estoque inválido ! Precione enter para voltar!")+piso)
        await rl.question("")
        return
    }
    const Preco= await rl.question(arrumar_opcoes("Preco por unidade(R$):")+pergunta)
    const preco_num = Number(Preco)
    if(Number.isNaN(preco_num)|| Number(Preco) < 0){
        console.log(arrumar_opcoes("Cadastro de preço inválido ! Precione enter para voltar!")+piso)
        await rl.question("")
        return
    }

    let dados = ler_arquivo()
    const id = dados.proximoid
    
    const produto = {
        id:id,
        Produto:Nome_do_Produto,
        Categoria : Categoria_Do_Produto,
        Quantidade: estoque_num,
        Preco : preco_num
    }
    imprime_produto(produto)
    const opcao = await rl.question(arrumar_opcoes("Você tem certeza:")+arrumar_opcoes("1)Sim")+arrumar_opcoes("2)Não")+pergunta)
    if(Number(opcao) === 1){
    console.log(arrumar_opcoes("O produto foi cadastrado com sucesso!Precione enter para voltar")+piso)
    await rl.question("")

    dados.produtos.push(produto)
    dados.total_produtos++
    dados.proximoid++
    
    fs.writeFileSync(`./produtos.json`,JSON.stringify(dados,null))
    }
    return
}

async function Atualizacao_do_Produto() {
    let ops = 0;
    do {
        await texto_de_input("Atualização de invetario AgilStore")
        const id = await rl.question(arrumar_opcoes("Id do produto a ser atualizado")+arrumar_opcoes("(Lembre-se que o id inicia no 1, e a saída é no 0):")+pergunta)
        if (id == 0) {
            return;
        }
        const dados = ler_arquivo()
        const indice = dados.produtos.findIndex(prod => prod.id == id)
        let produto = dados.produtos.find(produto => produto.id == id)
        if (produto == undefined) {
            console.log(arrumar_opcoes("ID não encontrado , favor escolher um válido!")+piso)
            await sleep(1)
        } else {
            do {
                const organizacao_cima=larguraTotal - 33 - produto.id.toString().length - produto.Produto.length - produto.Categoria.length
                const organizacao_baixo = larguraTotal - 28 - produto.Quantidade.toString().length - produto.Preco.toString().length
                dados.produtos[indice] = produto
                await texto_de_input("Atualização de Inventário AgilStore")
                await imprime_produto(produto)
                const rep = await rl.question(arrumar_opcoes("Escolha o que será atualizado:")+arrumar_opcoes("1)Nome")+arrumar_opcoes("2)Categoria")+arrumar_opcoes("3)Estoque")+arrumar_opcoes("4)Preco") +arrumar_opcoes("5)Atualizar outro produto")+arrumar_opcoes("0)Voltar")+piso_pergunta)
                switch (Number(rep)) {
                    case 1:
                        {
                            const novo_nome = await rl.question(arrumar_opcoes("Qual será o novo nome?")+pergunta)
                            const opcao = await rl.question(arrumar_opcoes("Você tem certeza da escolha:")+arrumar_opcoes("1)Sim")+arrumar_opcoes("2)Não") + piso_pergunta)
                            if (Number(opcao) === 1){
                                produto.Produto = novo_nome
                                dados.produtos[indice] = produto
                                fs.writeFileSync("./produtos.json", JSON.stringify(dados, null))

                            }
                            break;
                        }
                    case 2:
                        {
                            const nova_categoria = await rl.question(arrumar_opcoes("Qual será a nova categoria?") + pergunta)
                            const opcao = await rl.question(arrumar_opcoes("Você tem certeza da escolha:") + arrumar_opcoes("1)Sim") + arrumar_opcoes("2)Não") + piso_pergunta)
                            if (Number(opcao) === 1){
                                produto.Categoria = nova_categoria
                                dados.produtos[indice] = produto
                                fs.writeFileSync("./produtos.json", JSON.stringify(dados, null))

                            }
                                break;
                        }
                            case 3:
                        {
                            const novo_estoque = await rl.question(arrumar_opcoes("Qual será o novo estoque?")+pergunta)
                            const estoque_num = Number(novo_estoque)
                            if (Number.isNaN(estoque_num) || Number(novo_estoque) < 0) {
                                console.log(arrumar_opcoes("Atualização de estoque inválido ! Precione enter para voltar!") + piso)
                                await rl.question("")
                                break
                            }
                            const opcao = await rl.question(arrumar_opcoes("Você tem certeza da escolha:") + arrumar_opcoes("1)Sim") + arrumar_opcoes("2)Não") + piso_pergunta) 
                            if (Number(opcao) === 1){
                                produto.Quantidade = Number(novo_estoque)
                                dados.produtos[indice] = produto
                                fs.writeFileSync("./produtos.json", JSON.stringify(dados, null))

                            }
                            break
                        }
                    case 4:
                        {
                            const novo_preco = await rl.question(arrumar_opcoes("Qual será o novo preço?")+ pergunta)
                            const preco_num = Number(novo_preco)
                            if (Number.isNaN(preco_num) || Number(novo_preco) < 0) {
                                console.log(arrumar_opcoes("Atualização de preço inválida ! Precione enter para voltar!") + piso)
                                await rl.question("")
                                break
                            }
                            const opcao = await rl.question(arrumar_opcoes("Você tem certeza da escolha:") + arrumar_opcoes("1)Sim") + arrumar_opcoes("2)Não") + piso_pergunta)
                            if (Number(opcao) === 1){
                                produto.Preco = Number(novo_preco)
                                dados.produtos[indice] = produto
                                fs.writeFileSync("./produtos.json", JSON.stringify(dados, null))

                            }
                                break;
                        }
                    case 5:
                        fs.writeFileSync("./produtos.json", JSON.stringify(dados,null))
                        ops = 5;
                        break;
                    case 0:

                        fs.writeFileSync("./produtos.json", JSON.stringify(dados, null))
                        return
                    default:
                        console.log(arrumar_opcoes("Escolha inválida favor escolher uma opção possível") + arrumar_opcoes("Precione enter para voltar!")+piso)
                        await rl.question(" ")
                        break;
                }
            } while (ops !== 5)
        }
    } while (true)
}

async function apagar_produto() {
    let rep = 1;
    do {
        await texto_de_input("Apagar produto do Inventario Agil Store")
        const id = await rl.question(arrumar_opcoes("Id do produto a ser apagado(Lembre-se que o id inicia no 1, e a saída é no 0):") +  pergunta)
        if (id == 0) {
            return;
        }
        let dados = ler_arquivo()
        const produto = dados.produtos.find(produto => produto.id == id)
        if (produto === undefined) {
            console.log(arrumar_opcoes("ID não encontrado , favor escolher um válido! Precione enter para voltar!")+piso)
            await rl.question("")
            return
        } else {
            rl.write(arrumar_opcoes(`Você deseja apagar o produto:`))
            imprime_produto(produto)
            const ops = await rl.question(arrumar_opcoes("1)Sim")+arrumar_opcoes("2)Não")+piso_pergunta)

            if (Number(ops) == 1) {
                const produtos = dados.produtos.filter(produto => produto.id != id)
                dados.total_produtos--;
                if (dados.total_produtos <= 0) {
                    dados.total_produtos = 0;
                }
                dados.produtos = produtos
                const novos_dados = dados
                fs.writeFileSync(`./produtos.json`, JSON.stringify(novos_dados, null))
                rep = await rl.question(arrumar_opcoes("Quer apagar outro item do inventario")+arrumar_opcoes("1)Sim")+arrumar_opcoes("2)Não") + piso_pergunta)

            }
        }
    } while (Number(rep) === 1)
}

//Checar Inventário e suas funções

async function Checar_Inventario() {
    do {
        tela_de_inicio()

        const opcao = await rl.question(arrumar_opcoes("Qual a sua escolha:")+ arrumar_opcoes("1)Listar todos os produtos existentes no inventário")  + arrumar_opcoes("2)Buscar por um produto") + arrumar_opcoes("0)Voltar pro menu") +piso_pergunta)

        switch (Number(opcao)) {
            case 1:
                await listar_inventario()
                break;
            case 2:
                await buscar_produto()
                break;
            case 0:
                return
            default:
                console.log(arrumar_opcoes("Escolha inválida favor escolher uma opção possível"))
                    await rl.question(piso+"|"+centralizar("Pressione enter para voltar",largura_interior)+"|\n"+piso)

        }
    } while (true);

}
async function listagem_id() {
    await texto_de_input("Listagem de Inventário pelo ID")
    const dados = ler_arquivo()
    
    const escolha = await rl.question(arrumar_opcoes("Qual das listagem dos ids você quer:")+arrumar_opcoes("1)Crescente")+arrumar_opcoes("2)Decrescente")+piso_pergunta)
    if(Number(escolha) === 1 ){
        listar_produto(dados.produtos)
    }
    else if(Number(escolha )=== 2){
        produtos = dados.produtos;
        produtos.sort((a,b) => b.id - a.id)
        listar_produto(produtos)
    }

    await rl.question(piso+"|" + centralizar('Pressione enter para voltar', largura_interior)+"|\n"+piso)
    return
}

async function listagem_nome() {
    await texto_de_input("Listagem de Inventário pelo Nome")
    const dados = ler_arquivo()

    const escolha = await rl.question(arrumar_opcoes("Qual das listagem dos nomes você quer:") + arrumar_opcoes("1)Crescente") + arrumar_opcoes("2)Decrescente") + piso_pergunta )
    if(Number(escolha)=== 1){
        const nomes = dados.produtos;
        nomes.sort((a,b) => a.Produto.localeCompare(b.Produto))
        listar_produto(nomes)
    }else if(Number(escolha) === 2){
        const nomes = dados.produtos;
        nomes.sort((a, b) => b.Produto.localeCompare(a.Produto))
        listar_produto(nomes)
    }

    await rl.question(piso + "|" + centralizar('Pressione enter para voltar', largura_interior) + "|\n" + piso)
    return
}

async function listagem_categoria() {
    await texto_de_input("Listagem de Inventário pela Categoria")
    const dados = ler_arquivo()
    
    const categorias_presentes = [... new Set(dados.produtos.map(produto => produto.Categoria))].join(", ")

    const categoria = await rl.question(arrumar_opcoes("A lista de categorias presentes são:")+"|"+categorias_presentes+"\n"+arrumar_opcoes("Qual que você vai querer ver?")+arrumar_opcoes("Favor digite o nome completo da categoria,para uma listagem mais precisa)")+piso_pergunta)
    
    const categorias_filtradas = dados.produtos.filter(produto => produto.Categoria.toLowerCase().includes(categoria.toLowerCase()))

    if(categorias_filtradas == undefined){
        console.log(arrumar_opcoes("Categoria não existente no arquivo , favor escolher uma opção possivel!"))
        sleep(1)
        return
    }
    let produtos_por_categoria_filtrada = {}
    categorias_filtradas.forEach(produto => {
        const cat = produto.Categoria
        if(!produtos_por_categoria_filtrada[cat]){
            produtos_por_categoria_filtrada[cat] =[]
        }
        produtos_por_categoria_filtrada[cat].push(produto)
    })
    for(const categoria in produtos_por_categoria_filtrada){
        console.log(categoria)
        listar_produto(produtos_por_categoria_filtrada[categoria])
    }
    await rl.question(piso+"|"+centralizar("Pressione enter para voltar",largura_interior)+"|\n"+piso)
}
async function listagem_preco() {
    texto_de_input("Listagem de Inventário por Preco")
    const opcao = await rl.question(arrumar_opcoes("Escolha uma dessas classificações:")+arrumar_opcoes("1)Crescente")+arrumar_opcoes("2)Descrescente")+arrumar_opcoes("3)Intervalos")+piso_pergunta)
    if(Number(opcao) == 1){
        const dados = ler_arquivo()
        const numeros = dados.produtos
        numeros.sort((a,b) => a.Preco - b.Preco)
        listar_produto(numeros)
        await rl.question(piso+"|"+centralizar("Pressione enter para voltar",largura_interior)+"|\n"+piso)

    }else if(Number(opcao) == 2){
        const dados = ler_arquivo()
        const numeros = dados.produtos
        numeros.sort((a,b) => b.Preco - a.Preco)
        listar_produto(numeros)
        await rl.question(piso + "|" + centralizar("Pressione enter para voltar", largura_interior) + "|\n" + piso)
    }
    else if(Number(opcao) == 3){
    const min=await rl.question(arrumar_opcoes("Qual seria os intervalos de preço que você quer?")+arrumar_opcoes("O preço minimo utilize 0 e para pegar o preço maximo , utilize o termo 'inf'")+arrumar_opcoes("Minimo:")+pergunta)
    const max =await rl.question(arrumar_opcoes("Max:")+piso_pergunta)
        texto_de_input(`Listagem dos intens do interavlo entre o ${min} e o ${max}`)
        const dados = ler_arquivo()
        const intervalo = dados.produtos.filter(produtos => {
            if(max.toLowerCase() =='inf' ){
                return produtos.Preco >= Number(min)
            }
            else 
            return produtos.Preco >= Number(min) && produtos.Preco <= Number(max)
        })
        intervalo.sort((a,b) => a.Preco - b.Preco)
        listar_produto(intervalo)
        await rl.question(piso+"|"+centralizar("Pressione enter para voltar",largura_interior)+"|\n"+piso)

    }
}
async function listar_inventario() {
    let opcao = 1;
    do{
    texto_de_input("Inventario do AgilStore")
    opcao = await rl.question(arrumar_opcoes("Você quer listagem em ordem de:")+arrumar_opcoes("1)Id")+arrumar_opcoes("2)Nome")+arrumar_opcoes("3)Categoria")+arrumar_opcoes("4)Preço")+arrumar_opcoes("0)Voltar")+piso_pergunta)
    switch(Number(opcao)){
        case 1:
            await listagem_id()
            break
        case 2:
            await listagem_nome()
            break
        case 3:
            await listagem_categoria()
            break
        case 4:
            await listagem_preco()
            break
        case 0:
            return
    }
    }while(opcao !== 0)
}
async function buscar_produto() {
    let rep = 1;
    do{
    await texto_de_input("Busca no inventário AgilStore")
    const escolha = await rl.question(arrumar_opcoes("Qual será a sua forma de busca:")+arrumar_opcoes("1)Id")+arrumar_opcoes("2)Nome ou parte dele")+arrumar_opcoes("0)Voltar")+pergunta)
    const dados = ler_arquivo()
    if(Number(escolha) == 1){
    const id = await rl.question(arrumar_opcoes("Id do produto a ser buscado:")+pergunta)
    const produto = dados.produtos.find(produto => produto.id == id)
    if (produto == undefined) {
            console.log(arrumar_opcoes("ID não encontrado , favor escolher um válido!") + piso)
            await sleep(1)
    }else{
        imprime_produto(produto)
    }
    
}
    else if(Number(escolha) == 2){
    const nome = await rl.question(arrumar_opcoes("Nome do produto a ser buscado:")+pergunta)
    const produto = dados.produtos.filter((produto) => produto.Produto.toLowerCase().includes(nome.toLowerCase()))
    if(produto === undefined){
        console.log(arrumar_opcoes("Nome não encontrado , favor secolher um válido!")+piso)
        await sleep(1)
    }else{
        produto.forEach(produto => {
            imprime_produto(produto)
    }
    )
        
    }
}    
    else if(Number(escolha) === 0 ){
    return 
}   
    rep=await rl.question(arrumar_opcoes("Pressione 1 caso queira buscar outro produto , enter para voltar")+ piso)
    }while(Number(rep) === 1)
}



//Main
async function main(){
    do{
    tela_de_inicio()
        const opcao = await rl.question(arrumar_opcoes("Bem vindo ao inventario AgilStore qual a sua escolha?")+arrumar_opcoes("1)Modificar o inventário")+arrumar_opcoes("2)Checar o inventário")+arrumar_opcoes("0)Sair da aplicação")+piso_pergunta) 
    switch(Number(opcao)){
        case 1:
            await Modificar_Inventario()
            break;
        case 2 :
            await Checar_Inventario()
            break;
        case 0:
            rl.close()
            process.exit(0)
        
        default:
        console.log("Escolha inválida favor escolher uma opção possível")
        await sleep(1)
    }
    }
    while (true)
   

}
main()
