import type { Metadata } from "next";
import { GuideShell, H2 } from "@/components/guide-shell";
import { pageMetadata } from "@/lib/meta";

const title = "O primeiro fluxo em 15 minutos";
const description =
  "Importe o template de enriquecer CNPJ no Google Sheets com a Minha Receita, conecte a credencial e rode uma execução de teste.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui/primeiro-fluxo");

export default function Page() {
  return (
    <GuideShell
      title={title}
      description="O fluxo é real, está no diretório e a ficha foi conferida na fonte. A ideia cabe num quarto de hora se a conta do n8n e a do Google já existem."
      related={[
        {
          href: "/t/enriquecer-empresas-cnpj-google-sheets",
          title: "Enriquecer planilha de empresas com API de CNPJ",
          note: "É este o fluxo. 8 nodes, dificuldade fácil, JSON na fonte.",
        },
        {
          href: "/t/consulta-cnpj-minha-receita-formulario",
          title: "Consultar um CNPJ num formulário",
          note: "O mesmo dado, sem planilha, para conferir um fornecedor.",
        },
        {
          href: "/t/onboarding-fornecedores-cnpj-brasilapi",
          title: "Cadastrar fornecedores por CNPJ com BrasilAPI",
          note: "O passo seguinte, quando a consulta vira processo de aprovação.",
        },
        {
          href: "/integracao/google-sheets",
          title: "Outros templates com Google Sheets",
        },
        {
          href: "/categoria/produtividade",
          title: "Categoria Produtividade",
        },
      ]}
      sources={[
        {
          href: "https://n8n.io/workflows/7457-enriching-brazilian-company-data-with-cnpj-api-and-google-sheets/",
          label: "Fonte do template na n8n.io, o mesmo link do botão Abrir template",
        },
        { href: "https://minhareceita.org/", label: "Minha Receita, a API pública citada na ficha do template" },
        { href: "https://docs.n8n.io/hosting/installation/docker/", label: "Documentação: credencial é o cofre da autenticação" },
        { href: "https://n8n.io/pricing/", label: "Página de preços: uma rodada do fluxo é uma execução" },
      ]}
      faqs={[
        {
          question: "Preciso de chave da Receita Federal?",
          answer:
            "Não neste fluxo. A ficha diz que a consulta usa a API gratuita MinhaReceita.org, base da Receita, sem autenticação. A credencial que você cria é a do Google Sheets, e a do Telegram só se for usar o aviso final.",
        },
        {
          question: "Onde baixo o JSON?",
          answer:
            "Na página da fonte, pelo botão Abrir template do diretório. A ficha marca o JSON como baixável na origem. Este site não hospeda o arquivo.",
        },
        {
          question: "Rodar o teste gasta a franquia?",
          answer:
            "A central de ajuda do n8n diz que, em plano pago, execução manual feita no editor não entra na cota mensal. Uma rodada de teste é o jeito certo de aprender. Agenda ligada o dia inteiro é outra conversa, tratada na página de preços.",
        },
      ]}
    >
      <p>
        O fluxo se chama “Enriquecer planilha de empresas brasileiras com API de CNPJ”, de Vitorio Magalhães, publicado na fonte em 15 de agosto de 2025. A ficha do diretório resume o que ele faz: lê CNPJs no Google Sheets, consulta a Minha Receita sem autenticação, atualiza a planilha em lotes com endereço, situação cadastral, sócios e outros campos, e avisa no Telegram quando termina. São 8 nodes, fora as notas adesivas. A dificuldade está marcada como fácil. É linear o bastante para ser o primeiro.
      </p>
      <p>
        Quinze minutos assume três coisas prontas: um n8n aberto (o teste do Cloud basta), uma conta Google e meia dúzia de CNPJs que você já pode consultar, de preferência o da sua própria empresa. Telegram é opcional. Se você ainda não tem o n8n, volte em “Onde hospedar” e abra o Cloud. Não comece este exercício criando VPS.
      </p>
      <H2>Minuto 0 a 3: a planilha</H2>
      <p>
        Crie uma planilha no Google Sheets. Na primeira linha, um cabeçalho. Uma coluna precisa se chamar de um jeito que você reconheça como CNPJ, por exemplo <span className="text-ink">cnpj</span>. Nas linhas de baixo, coloque poucos CNPJs, só dígitos ou com pontuação. Três linhas chegam. O fluxo lê essa coluna, então não encha a planilha com a base inteira da empresa na primeira execução. Você quer ver um resultado, não disparar centenas de consultas sem ter olhado o formato.
      </p>
      <p>
        Deixe a planilha no seu Drive, na conta que você vai autorizar daqui a pouco. Se a planilha for de outro Google, a credencial não enxerga.
      </p>
      <H2>Minuto 3 a 6: abrir a fonte e importar</H2>
      <p>
        No diretório, abra a ficha do template e use Abrir template. O botão sai para a página do fluxo na n8n.io. A ficha marca <span className="text-ink">json_downloadable</span> como verdadeiro: o JSON está na fonte, para baixar. Este site não guarda cópia.
      </p>
      <p>
        No seu n8n, importe esse arquivo. O caminho de menu muda de versão para versão, então o gesto é o que importa: procurar importar workflow a partir de arquivo, escolher o JSON e ver o desenho aparecer no canvas. Você deve ver uma sequência, não um agente com dezenas de ramos. Se aparecer um fluxo enorme, o arquivo não é este. Confira o título na ficha.
      </p>
      <p>
        Não ative o workflow ainda. Ativar liga o gatilho de produção. A primeira vez é manual.
      </p>
      <H2>Minuto 6 a 10: a credencial do Google</H2>
      <p>
        A consulta à Minha Receita, segundo a ficha, não usa credencial. O Google Sheets usa. Clique no node que lê ou escreve a planilha e crie a credencial. O n8n abre o OAuth do Google. Você entra na conta dona da planilha e autoriza. A documentação descreve credencial como o lugar onde fica a autenticação. O node passa a apontar para esse cofre.
      </p>
      <p>
        Em seguida, escolha a planilha e a aba certas. Se o node pedir o nome da coluna, use o cabeçalho que você criou. Erro clássico: a coluna na planilha se chama “CNPJ” e o node procura “cnpj” com outro espaço, ou a aba ativa não é a que tem os dados. A execução vai dizer isso com uma lista vazia. Não é falha da API.
      </p>
      <H2>Minuto 10 a 13: uma execução manual</H2>
      <p>
        Aperte o teste no canvas, a execução manual. Espere a sequência andar. Abra a execução na lista. Em cada node dá para ver a entrada e a saída. No node da Minha Receita, a saída deve trazer campos de empresa: situação cadastral, endereço, sócios. A ficha diz que a atualização da planilha acontece em lotes. Se você deixou três CNPJs, o lote é pequeno e a planilha deve ganhar colunas ou preencher as que o template já espera.
      </p>
      <p>
        Se a API devolver erro para um CNPJ, olhe o número. Pontuação a mais, dígito faltando ou CNPJ inexistente aparecem aqui. Corrija a célula e rode de novo. Uma rodada manual, em plano pago, não entra na franquia mensal, segundo a central de ajuda. Pode repetir sem medo de “gastar o Starter” nesse teste.
      </p>
      <p>
        Uma execução sua, com três CNPJs dentro, conta como uma rodada do workflow na definição da página de preços, não como três. Isso só muda se o template estiver desenhado para disparar uma execução por linha de fora para dentro. Na ficha, a leitura da planilha e a atualização em lotes estão no mesmo fluxo. Confirme na execução que você acabou de abrir: um item na lista de execuções, vários itens de dados dentro.
      </p>
      <H2>Minuto 13 a 15: Telegram, ou não</H2>
      <p>
        A ficha inclui um aviso no Telegram quando o trabalho termina. Se você não quer criar bot agora, deixe esse node desligado ou pule a credencial dele e não ative o fluxo. O miolo, planilha e Minha Receita, já prova que você entendeu gatilho, node, credencial e execução.
      </p>
      <p>
        Se for ligar o Telegram, o caminho é o mesmo das outras chaves: crie o bot no Telegram, guarde o token na credencial, escolha o chat que recebe o “terminei”. Não cole o token num bilhete adesivo do canvas.
      </p>
      <H2>O que não fazer na sequência</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Não apontar a planilha para a base inteira de clientes antes de ver uma linha certa.</li>
        <li>Não transformar isso num agendamento a cada 5 minutos. A página de preços estima 8.600 a 8.900 execuções no mês para esse ritmo. Uma enriquecida por dia, ou um botão quando a planilha muda, cabe melhor.</li>
        <li>Não trocar a Minha Receita por outro serviço no mesmo node sem ler a resposta. O formato do JSON muda. O mapeamento que escreve na planilha quebra em silêncio ou escreve vazio.</li>
      </ul>
      <H2>Para onde ir com o mesmo músculo</H2>
      <p>
        O template “Consultar empresa brasileira por CNPJ na Minha Receita” faz a consulta num formulário do n8n, valida o tamanho do CNPJ e mostra uma página de sucesso ou de erro. É o mesmo dado, sem planilha, bom para quem atende no balcão e quer conferir um fornecedor.
      </p>
      <p>
        “Cadastrar fornecedores brasileiros por CNPJ com BrasilAPI” é o irmão maior: formulário, validação de dígito, score de risco e e-mail para o comprador aprovar. A ficha marca como avançado, com 45 nodes. Só abra depois que a planilha simples tiver rodado. Aí você já sabe ler uma execução e o tamanho não assusta do mesmo jeito.
      </p>
      <p>
        Quando esse primeiro fluxo estiver chato de tão repetido, você já pode ler “Conectar as pontas” e escolher um webhook de verdade, de Pix ou de Hotmart. O vocabulário é o mesmo. Só a direção da chamada muda.
      </p>
    </GuideShell>
  );
}
