function MyApp({ pdf }) {
    
    return (
      <div >
        <iframe 
        src={`${pdf.output('datauristring')}#toolbar=0&navpanes=0 `} 
        className="w-full h-[650px] pointer-events-none " 
        />
      </div>
    );
  }
  
  export default MyApp;