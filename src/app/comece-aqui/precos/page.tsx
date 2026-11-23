import type { Metadata } from "next";
import { GuideShell, H2 } from "@/components/guide-shell";
import { pageMetadata } from "@/lib/meta";

const title = "Quanto custa o n8n em novembro de 2026";
const description =
  "Planos do n8n Cloud, limites de execução conferidos na central de ajuda, a licença Community e o preço publicado de um VPS.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui/precos");

export default function Page() {
  return (
    <GuideShell
      title={title}
      description="Tem duas faturas possíveis. Uma é a do n8n. A outra é a da máquina, se você mesmo hospedar. Elas não se somam no Cloud e não se misturam na Community."
      related={[
        {
          href: "/t/relatorio-diario-google-ads-whatsapp-evolution",
          title: "Relatório diário do Google Ads no WhatsApp",
          note: "Agenda diária: cerca de 30 execuções no mês, no exemplo da própria página de preços.",
        },
        {
          href: "/t/enriquecer-empresas-cnpj-google-sheets",
          title: "Enriquecer planilha de CNPJ",
          note: "Roda quando você dispara. O custo segue o número de rodadas, não o número de CNPJs dentro de uma rodada.",
        },
        {
          href: "/t/webhook-kiwify-hotmart-planilha-telegram",
          title: "Webhook de compra da Kiwify ou Hotmart",
          note: "Cada aviso de compra é uma execução.",
        },
        {
          href: "/categoria/financeiro-pix",
          title: "Templates de financeiro e Pix",
        },
        {
          href: "/comece-aqui/hospedagem",
          title: "Onde hospedar, com o preço dos VPS",
        },
      ]}
      sources={[
        { href: "https://n8n.io/pricing/", label: "Página de preços do n8n" },
        { href: "https://docs.n8n.io/choose-how-to-use-n8n/", label: "Documentação: edições Community, Business e Enterprise" },
        { href: "https://docs.n8n.io/n8n-community-license/community-license/license-faq", label: "FAQ da licença Community (Sustainable Use License)" },
        { href: "https://support.n8n.io/article/can-i-add-more-executions", label: "Central de ajuda: como aumentar execuções, atualizada em 27 ago 2026" },
        { href: "https://support.n8n.io/article/can-you-reset-my-executions", label: "Central de ajuda: limite do Starter, do teste e do Pro, atualizada em 22 out 2026" },
        { href: "https://support.n8n.io/article/fewer-assistant-credits-october-2026", label: "Central de ajuda: créditos do Assistant desde 1º out 2026" },
        { href: "https://www.hostinger.com/vps-hosting", label: "Hostinger VPS" },
        { href: "https://www.hetzner.com/cloud", label: "Hetzner Cloud" },
        { href: "https://www.digitalocean.com/pricing/droplets", label: "DigitalOcean Droplets" },
      ]}
      faqs={[
        {
          question: "O plano anual muda quantas execuções eu tenho?",
          answer:
            "Não. A central de ajuda diz que a franquia mensal é a mesma no mensal e no anual. O anual só muda o preço. As execuções zeram no dia 1º de cada mês, não na data da fatura.",
        },
        {
          question: "Se eu estourar o limite, o fluxo fica na fila?",
          answer:
            "Não, segundo a central de ajuda atualizada em outubro de 2026. A execução nasce e falha na hora, com o erro de limite de plano. Fila é outra coisa: é o limite de execuções simultâneas.",
        },
        {
          question: "A Community tem teto de execuções?",
          answer:
            "A página de escolha de uso diz que a Community é gratuita e fica disponível por tempo indeterminado. A FAQ da licença não publica um teto mensal de execuções. O limite que ela publica é de uso: o que você pode fazer com o software, não um pacote de mil rodadas.",
        },
      ]}
    >
      <p>
        O número que muda a sua conta no n8n Cloud é a execução. A página de preços define execução como uma rodada inteira do workflow. Dez passos dentro do mesmo fluxo, no mesmo disparo, continuam sendo uma execução. Um disparo novo é outra. Eles escrevem que outras ferramentas cobram por passo ou por tarefa, e que por isso a conta do n8n é mais previsível. Todos os planos da página incluem usuários ilimitados, workflows ilimitados e todas as integrações. O medidor é a rodada.
      </p>
      <H2>O que a página de preços mostra em euro</H2>
      <p>
        Os preços abaixo são os publicados em n8n.io/pricing, no plano anual, como valor por mês. A página não lista, no cartão, o preço do mesmo plano cobrado mês a mês. Onde ela não publica o número, a gente não completa.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-ink">Starter.</span> 20 euros por mês, cobrados no anual. Inclui 1 projeto compartilhado, 5 execuções simultâneas, 1.600 créditos de Assistant por mês e suporte no fórum. Na tabela, o histórico de workflow guarda no máximo 1 dia, as execuções salvas vão até 2,5 mil, o armazenamento delas até 2,5 GB, a retenção do log até 7 dias e a duração máxima de uma execução é 5 minutos.
        </li>
        <li>
          <span className="text-ink">Pro.</span> 50 euros por mês, cobrados no anual. O cartão fala em até 50 execuções simultâneas, até 9.600 créditos de Assistant por mês, 7 dias de insights, papéis de admin e histórico de workflow. A tabela de comparação, na coluna Pro, mostra execuções simultâneas como 20 / 50, execuções salvas até 25 mil, 25 GB, retenção de 30 dias e duração máxima de 40 minutos. O histórico de workflow na tabela é de 5 dias.
        </li>
        <li>
          <span className="text-ink">Business.</span> 667 euros por mês, cobrados no anual, para empresas com menos de 100 funcionários. O cartão inclui SSO, LDAP, vários ambientes, modo fila, versionamento com Git e 30 dias de insights. Existe um plano Startup: quem tem menos de 20 funcionários pode pedir 50% de desconto no Business. A página manda checar se você se qualifica. Não publicamos um preço fechado de Startup além desse desconto.
        </li>
        <li>
          <span className="text-ink">Enterprise.</span> sob consulta, com execuções sob medida. Pode ser hospedado por eles ou self-hosted.
        </li>
      </ul>
      <p>
        “Execuções salvas” não é a mesma coisa que a franquia do mês. A página explica que eles guardam as execuções recentes para você depurar, até bater o número, o espaço ou a janela de dias, o que vier primeiro. Bater esse teto não para o workflow. Só encurta o histórico.
      </p>
      <H2>A franquia mensal está na central de ajuda</H2>
      <p>
        O cartão de preço não escreve “2.500 execuções” ao lado do Starter. Quem escreve é a central de ajuda, em artigos atualizados em 2026. Vale citar os dois lados para não misturar.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Teste: 1.000 execuções. O artigo de 22 de outubro de 2026 diz isso ao explicar o reset de cortesia.</li>
        <li>Cloud Starter: 2.500 execuções por mês, no mesmo artigo.</li>
        <li>Cloud Pro-1: 10.000 execuções. O artigo de 27 de agosto de 2026 diz que quem está no Starter sobe para o Pro-1 para ter essas 10.000.</li>
        <li>Cloud Pro-2: 50.000 execuções. O mesmo artigo diz que o Pro-1 sobe para o Pro-2 para ter 50.000.</li>
        <li>
          No Pro-2 mensal dá para comprar mais, em degraus, até 500.000, por 2 euros (ou 2 dólares, ou 2 libras, ou R$ 12,50) mais imposto a cada 1.000 execuções extras. O artigo escreve “12.5R$”. No Pro-2 anual esse self-service não existe. Você escreve para help@n8n.io.
        </li>
      </ul>
      <p>
        A página de preços não publica um euro separado para Pro-1 e Pro-2. Ela mostra um cartão Pro a 50 euros por mês no anual. A central de ajuda trata Pro-1 e Pro-2 como tamanhos, com franquias diferentes. Sem um preço oficial para cada tamanho, a gente não inventa qual dos dois custa 50 euros.
      </p>
      <p>
        Os créditos do Assistant, desde 1º de outubro de 2026, estão num artigo da própria central: Starter 1.600, Pro-1 4.000, Pro-2 9.600. O teste leva 800 créditos, que expiram com o teste. A página de preços ainda soma “100 AI credits” na descrição do teste do Cloud. Rodar workflow não gasta crédito de Assistant. Crédito é para o assistente que ajuda a montar o fluxo.
      </p>
      <p>
        O teste do Cloud, na página de preços, não pede cartão. Os limites escritos ali são 1.000 execuções, 5 simultâneas, timeout de 180 segundos e 1 projeto. A documentação de escolha de uso descreve esse teste como 14 dias com recursos de nível Pro. O teste do plano Business, na página de preços, dura 14 dias e pede cartão.
      </p>
      <p>
        Se a franquia acaba, o artigo de outubro é específico: a execução não entra numa fila. Ela falha na hora, com o texto de que o limite foi atingido. Isso vale para teste, Starter, Pro-1 e Pro-2. O contador zera no dia 1º, não na data da sua fatura. Execução que falhou por esse motivo não conta na cota, segundo o mesmo artigo. Execução manual no editor, chat e subworkflow, em plano pago, também não entram nessa cota.
      </p>
      <H2>Community: grátis, com licença, sem pacote de rodadas</H2>
      <p>
        A página de preços aponta a Community Edition como a versão self-hosted padrão, no GitHub. A documentação diz que ela é gratuita e pode ficar assim por tempo indeterminado, com quase o conjunto completo. Registrar o e-mail, de graça, libera pastas, debug no editor e dados customizados de execução. Business e Enterprise self-hosted são pagos e entram com uma chave de licença.
      </p>
      <p>
        A mesma documentação lista recursos que pedem plano pago, entre eles variáveis customizadas, ambientes, cofre externo de segredo, log streaming, projetos, SSO, compartilhamento de workflow e credencial, e versionamento com Git. A lista muda. A página de preços é a fonte que eles mandam consultar.
      </p>
      <p>
        A licença da Community se chama Sustainable Use License. Ela vale para o self-hosted, não para o Cloud. A FAQ oficial diz o que cabe e o que não cabe. Cabe usar para o seu negócio, para estudo, para cobrar de cliente a construção e a manutenção do fluxo, e para atender vários clientes na sua instância, desde que o cliente não entre no n8n para montar o fluxo. Não cabe oferecer o n8n como serviço em que o cliente constrói o próprio workflow, tirar a marca e revender, nem usar recurso que pede chave Enterprise sem a licença. Não há, nessa FAQ, um teto do tipo “até X execuções” ou “até X clientes”. O texto diz que não há limite de clientes numa instância só. O limite é o acesso: o cliente recebe o resultado, não o editor.
      </p>
      <H2>A máquina, quando a licença é zero</H2>
      <p>
        Se o n8n é Community, a mensalidade que sobra é a do VPS. Números conferidos nas páginas dos provedores em novembro de 2026, na moeda que eles publicam:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Hostinger KVM 2: anúncio de US$ 8,79 por mês no prazo longo, renovação a US$ 14,99, com 2 vCPUs, 8 GB e 100 GB. A página cita o n8n como exemplo de aplicação desse porte.</li>
        <li>Hetzner Cloud: planos compartilhados a partir de € 5,49 ou € 5,99 por mês, sem IVA.</li>
        <li>DigitalOcean Droplet Basic: US$ 6 por mês com 1 GiB, ou US$ 12 com 2 GiB.</li>
      </ul>
      <p>
        Railway, Render, Coolify e Easypanel estão na página de hospedagem, com o detalhe de plano free que dorme e de painel cobrado por servidor. Não convertemos euro nem dólar para real. O único valor em real que a central de ajuda do n8n publica, entre os textos que lemos, é aqueles R$ 12,50 por mil execuções extras no Pro-2.
      </p>
      <H2>Uma conta rápida, com o exemplo deles</H2>
      <p>
        A própria página de preços ensina a estimar. Agenda diária: cerca de 30 ou 31 execuções no mês. Agenda a cada 5 minutos: cerca de 8.600 a 8.900. Webhook: uma execução por evento. Chat: mensagens vezes conversas.
      </p>
      <p>
        Um relatório diário de anúncio no WhatsApp, como o template do diretório, cabe folgado em 2.500. Um fluxo que olha WhatsApp a cada 5 minutos o mês inteiro não cabe no Starter. Ou você muda o gatilho para webhook, ou sobe de franquia, ou vai para a Community e paga a máquina. Essa é a conta inteira. O resto é detalhe de cartão.
      </p>
    </GuideShell>
  );
}
