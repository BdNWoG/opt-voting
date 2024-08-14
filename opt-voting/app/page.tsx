import Initialization from './components/Initialization';

export default function Home() {
  return (
    <div>
      <section id="description" style={{ padding: '80px 20px 0px' }}>
        <h2 className="section-heading">Description</h2>
        <p className="section-paragraph">
          This is a brief paragraph of text that describes the purpose of the Optimism Voting Strategy. 
          It provides an overview of the research and its potential implications in blockchain technology.
        </p>
      </section>

      {/* Use the Initialization component here */}
      <Initialization />

      <section id="results" style={{ padding: '20px 20px' }}>
        <h2 className="section-heading">Results</h2>
        <p>Content for Results section...</p>
      </section>

      <section id="measurement" style={{ padding: '20px 20px' }}>
        <h2 className="section-heading">Measurement</h2>
        <p>Content for Measurement section...</p>
      </section>

      <section id="explanation" style={{ padding: '20px 20px' }}>
        <h2 className="section-heading">Explanation</h2>
        <p>Content for Explanation section...</p>
      </section>
    </div>
  );
}
