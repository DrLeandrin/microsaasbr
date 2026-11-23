import type { Metadata } from "next";
import { Code, GuideShell, H2 } from "@/components/guide-shell";
import { pageMetadata } from "@/lib/meta";

const title = "Onde hospedar o n8n: Cloud ou VPS";
const description =
  "n8n Cloud ou self-hosted num VPS, com Docker, preços conferidos de Hostinger, Hetzner, DigitalOcean, Railway, Render, Coolify e Easypanel.";

export const metadata: Metadata = pageMetadata(title, description, "/comece-aqui/hospedagem");

export default function Page() {
  return (
    <GuideShell
      title={title}
      description="A primeira decisão prática é onde o n8n mora. As duas portas oficiais são o n8n Cloud e uma instalação sua. O resto é detalhe de servidor."
      related={[
        {
          href: "/t/buffer-mensagens-whatsapp-redis-evolution",
          title: "Buffer de mensagens do WhatsApp com Redis",
          note: "Fluxo que já assume Evolution API e Redis, típico de quem self-hospeda a pilha.",
        },
        {
          href: "/t/agente-ia-simples-evolution-api",
          title: "Agente de IA simples no WhatsApp com Evolution API",
          note: "Precisa de uma URL pública para a Evolution falar com o n8n.",
        },
        {
          href: "/t/enriquecer-empresas-cnpj-google-sheets",
          title: "Enriquecer planilha de CNPJ",
          note: "Dá para rodar no Cloud de teste, sem montar servidor.",
        },
        {
          href: "/integracao/evolution-api",
          title: "Templates com Evolution API",
        },
        {
          href: "/integracao/whatsapp",
          title: "Templates com WhatsApp",
        },
      ]}
      sources={[
        { href: "https://docs.n8n.io/choose-how-to-use-n8n/", label: "Documentação: Cloud ou self-hosted" },
        { href: "https://docs.n8n.io/hosting/installation/docker/", label: "Documentação: instalar com Docker" },
        { href: "https://n8n.io/pricing/", label: "Preços do n8n Cloud e nota de que os dados hospedados ficam em Frankfurt" },
        { href: "https://www.hostinger.com/vps-hosting", label: "Hostinger: planos KVM de VPS" },
        { href: "https://www.hetzner.com/cloud", label: "Hetzner Cloud: preços de partida e localidades" },
        { href: "https://www.digitalocean.com/pricing/droplets", label: "DigitalOcean: preços de Droplets" },
        { href: "https://railway.com/pricing", label: "Railway: planos e o sono do plano Free" },
        { href: "https://render.com/pricing", label: "Render: planos e compute" },
        { href: "https://coolify.io/pricing", label: "Coolify: self-hosted grátis e Cloud" },
        { href: "https://easypanel.io/pricing", label: "Easypanel: planos por servidor" },
      ]}
      faqs={[
        {
          question: "Dá para testar sem comprar VPS?",
          answer:
            "Sim. A documentação recomenda começar pelo n8n Cloud quando você quer acesso imediato. O teste do Cloud não pede cartão, segundo a página de preços. O VPS entra quando você decide administrar a máquina.",
        },
        {
          question: "O túnel do n8n serve para produção?",
          answer:
            "Não. A página de Docker diz para usar o túnel só em desenvolvimento local e que não é seguro em produção.",
        },
        {
          question: "Qual desses provedores tem datacenter no Brasil?",
          answer:
            "Nas páginas conferidas em novembro de 2026, a Hetzner lista Alemanha, Finlândia, Singapura e Estados Unidos. A DigitalOcean lista cidades nos EUA, Canadá, Europa, Índia, Singapura e Austrália, sem São Paulo. O n8n Cloud diz que os dados hospedados ficam em Frankfurt. Não achamos, nessas páginas, um datacenter brasileiro para afirmar.",
        },
      ]}
    >
      <p>
        Hospedar é decidir quem liga o computador onde o n8n está rodando. Ou a n8n GmbH liga esse computador para você, no n8n Cloud, ou você liga, num VPS, num computador de casa ou num painel que instala o Docker por você. A documentação chama isso de a primeira decisão e publica uma tabela curta: quem quer começar agora e não quer cuidar de infraestrutura vai de Cloud. Quem quer controle do ambiente vai de self-hosted.
      </p>
      <H2>n8n Cloud, a porta sem instalação</H2>
      <p>
        No Cloud você cria a conta e cai no editor. Não tem Docker, não tem porta 5678, não tem certificado. A página de preços diz que, nos planos hospedados, os dados ficam na União Europeia, em servidores em Frankfurt, na Alemanha. Para um negócio no Brasil isso tem dois efeitos práticos. O primeiro é latência: cada ida e volta até a Europa é mais longa do que até São Paulo. Para um agente de WhatsApp que responde na hora, a distância até a Europa existe. A gente não mediu esse atraso, então não publica um número. O segundo efeito é contratual: o dado do fluxo mora na Europa, sob o regime que eles descrevem na página de preços. Se o seu jurídico exige o dado no Brasil, Cloud hospedado por eles não atende essa frase. A gente não viu, na página de preços, uma região brasileira.
      </p>
      <p>
        A documentação também é direta com quem nunca administrou servidor. Na página de Docker, o aviso diz que self-hosting pede saber configurar servidor, recurso, segurança e o próprio n8n, e que erro aqui vira perda de dado, falha de segurança e indisponibilidade. A recomendação escrita deles, para quem não tem essa prática, é o n8n Cloud.
      </p>
      <H2>Self-hosted é você com a máquina</H2>
      <p>
        Self-hosted significa que o programa roda numa infraestrutura sua. A edição Community é gratuita. A página “Como usar o n8n” descreve essa edição como o jeito de rodar de graça, com quase o conjunto completo de recursos, pelo tempo que você quiser. Recursos como SSO, ambientes e projetos pedem plano pago. Isso está na página de preços deste guia, com a lista que a documentação publica.
      </p>
      <p>
        Por padrão, a instalação Docker usa SQLite para guardar workflow, credencial e execução. A mesma página diz que PostgreSQL também funciona, por variáveis de ambiente, e que ainda assim vale persistir a pasta <span className="text-ink">.n8n</span>, porque lá ficam chave de criptografia e outros arquivos. Para um primeiro VPS, SQLite chega. Quando o fluxo for de verdade e você não quiser perder o histórico num disco cheio, Postgres entra.
      </p>
      <H2>Docker, em uma página</H2>
      <p>
        Docker é um jeito de empacotar o programa com as bibliotecas que ele espera, para ele rodar igual em máquinas diferentes. A imagem é o pacote. O container é esse pacote rodando. O volume é a pasta que sobrevive quando você apaga o container para atualizar. Sem volume, atualizar apaga workflow e credencial.
      </p>
      <p>
        A documentação recomenda Docker para a maioria dos self-hostings e aponta o Docker Compose como o método recomendado. O comando abaixo é o exemplo publicado na página de instalação com Docker. Troque o fuso. No Brasil, o valor usual é <span className="text-ink">America/Sao_Paulo</span>. O <span className="text-ink">GENERIC_TIMEZONE</span> acerta nodes de agenda. O <span className="text-ink">TZ</span> acerta o relógio do sistema.
      </p>
      <Code>{`docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 \\
  -e GENERIC_TIMEZONE="America/Sao_Paulo" \\
  -e TZ="America/Sao_Paulo" \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -v n8n_data:/home/node/.n8n \\
  n8nio/n8n`}
      </Code>
      <p>
        A porta 5678 é a tela. Em produção você coloca HTTPS na frente, com um domínio seu. Sem HTTPS, webhook de Mercado Pago, Hotmart e WhatsApp não é confiável: esses serviços chamam um endereço público e seguro. O túnel que o n8n oferece na documentação é explícito: só para desenvolvimento local, não é seguro em produção.
      </p>
      <H2>Provedores, com o preço que a página deles mostra</H2>
      <p>
        Um VPS é um pedaço de servidor alugado. Você recebe um Linux, um IP e a responsabilidade. Os números abaixo são os que estavam nas páginas oficiais em novembro de 2026. Promoção muda. Imposto e câmbio do cartão brasileiro não estão nessas páginas, então não inventamos conversão para real.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-ink">Hostinger.</span> A página de VPS lista KVM 1 a KVM 8. O preço riscado do KVM 1 é US$ 19,49 e o anunciado é US$ 6,49 por mês, com a letra miúda de que hoje se paga US$ 155,76 por 24 meses e a renovação fica US$ 11,99 por mês no mesmo prazo. O KVM 2, marcado como o mais popular, anuncia US$ 8,79 por mês (de US$ 24,49), cobra US$ 210,96 por 24 meses e renova a US$ 14,99. A própria página diz que o KVM 2 tem 2 vCPUs, 8 GB de RAM e 100 GB NVMe, “o bastante para hospedar aplicações de médio porte, como a ferramenta de automação n8n”. É a única frase, entre os provedores que abrimos, em que o nome n8n aparece no plano.
        </li>
        <li>
          <span className="text-ink">Hetzner.</span> A página de Cloud mostra planos compartilhados a partir de € 5,49 por mês no Regular Performance e € 5,99 no Cost-Optimized, sem IVA. Servidor de uso geral, com vCPU dedicada, a partir de € 36,99. Os datacenters listados são Alemanha, Finlândia, Singapura e Estados Unidos. Não há Brasil nessa lista.
        </li>
        <li>
          <span className="text-ink">DigitalOcean.</span> A tabela de Droplets Basic começa em US$ 4 por mês (512 MiB, 1 vCPU, 10 GiB) e segue para US$ 6 (1 GiB, 25 GiB) e US$ 12 (2 GiB, 50 GiB). A cobrança que eles descrevem é por segundo, com teto mensal no plano empacotado. As cidades listadas na página não incluem o Brasil.
        </li>
        <li>
          <span className="text-ink">Railway.</span> O plano Free custa US$ 0 e inclui US$ 1 de uso por mês, com no máximo 1 vCPU e 0,5 GB por serviço. Os serviços desse plano dormem depois de 5 a 10 minutos sem tráfego de saída e acordam no próximo pedido. Hobby e acima ficam ligados. Hobby custa US$ 5 por mês e já inclui US$ 5 de uso. Para webhook de Pix, serviço que dorme é um problema: o Mercado Pago chama, ninguém responde, a execução não nasce.
        </li>
        <li>
          <span className="text-ink">Render.</span> O workspace Hobby é US$ 0 mais o compute. Há instância Free a US$ 0 com 512 MB, instância com menos de 1 CPU a US$ 7 por mês com 512 MB, e 1 CPU com 2 GB a US$ 25 por mês. O plano Pro do workspace é US$ 25 por mês mais compute. A página não descreve, no trecho de compute, um datacenter no Brasil.
        </li>
      </ul>
      <H2>Coolify e Easypanel não são o VPS</H2>
      <p>
        Coolify e Easypanel são painéis. Eles instalam aplicação, banco e HTTPS em cima de um servidor que continua sendo seu, ou, no caso do Coolify Cloud, o painel é deles e o servidor ainda é seu.
      </p>
      <p>
        A página de preços do Coolify diz que a versão self-hosted é grátis para sempre, com os recursos, e que você precisa da sua infraestrutura. O Coolify Cloud custa US$ 5 por mês como base, para conectar 2 servidores, mais US$ 3 por mês por servidor extra.
      </p>
      <p>
        A página do Easypanel mostra um plano Free com até 3 projetos, serviços ilimitados e deploys ilimitados. Os pagos são por servidor: Hobby a US$ 14,9 por mês, ou US$ 10,9 por mês no anual. Growth a US$ 23,9 (US$ 16,9 no anual). Business a US$ 37,9 (US$ 29,9 no anual). O anual está publicado como o preço mensal efetivo.
      </p>
      <p>
        Para quem está começando, o painel economiza a noite em que você configuraria Nginx e certificado. Ele não economiza o VPS, o backup nem o entendimento de que a chave de criptografia do n8n precisa sobreviver a uma atualização.
      </p>
      <H2>O que pesa para quem está no Brasil</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-ink">Começar.</span> Cloud ganha. A documentação recomenda essa porta para quem não quer instalar nada.
        </li>
        <li>
          <span className="text-ink">Webhook de verdade.</span> URL pública com HTTPS. Cloud já entrega. No VPS, você configura. Plano que coloca o processo para dormir, como o Free da Railway, atrapalha.
        </li>
        <li>
          <span className="text-ink">Onde o dado fica.</span> Cloud: Frankfurt, segundo a página de preços. VPS: o datacenter que você marcar. Nenhum dos provedores acima, nas páginas lidas, ofereceu São Paulo.
        </li>
        <li>
          <span className="text-ink">Atualização.</span> No Cloud, eles atualizam. No Docker, você puxa a imagem nova e sobe de novo, com o volume no lugar. A página de Docker mostra <span className="text-ink">docker pull n8nio/n8n</span> para a versão stable.
        </li>
        <li>
          <span className="text-ink">Conta no fim do mês.</span> Cloud cobra o plano do n8n. VPS cobra a máquina, e o n8n Community em si não tem mensalidade. Some os dois só quando for o seu caso. A página de preços deste guia separa as duas faturas.
        </li>
      </ul>
      <p>
        Se a sua pressa é ver um fluxo rodar hoje à noite, fique no Cloud e pule para o primeiro fluxo. Se a pressa é WhatsApp com Evolution na sua VPS, escolha uma máquina que não durma, guarde o volume e só então importe o template.
      </p>
    </GuideShell>
  );
}
