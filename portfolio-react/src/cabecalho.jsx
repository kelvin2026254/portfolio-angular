// Cabecalho: a barra de topo do Portfolio, com o nome e os links.
// Um componente e uma funcao que devolve JSX. O nome comeca com maiuscula.
function Cabecalho() {
  return (
    <header>
      <h1>Meu Portfólio</h1>
      <nav>
        <a href="#">Início</a>
        <a href="#">Sobre</a>
        <a href="#">Projetos</a>
        <a href="#">Contato</a>
      </nav>
    </header>
  );
}

export default Cabecalho;