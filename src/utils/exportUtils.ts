import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Template } from '../features/templates/types';

export const exportToPdf = async (template: Template) => {
  // Create a temporary div to render the content
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #333;">${template.title}</h1>
      <p><strong>Category:</strong> ${template.category}</p>
      <p><strong>Description:</strong> ${template.description}</p>
      
      <h2>Design Context</h2>
      ${template.designContext}
      
      <h2>System Impacts</h2>
      ${template.systemImpacts}
      
      <h2>Assumptions</h2>
      ${template.assumptions}
      
      <h2>Out of Scope</h2>
      ${template.outOfScope}
      
      <h2>Other Areas to Consider</h2>
      ${template.otherAreasToConsider}
      
      <h2>Appendix</h2>
      ${template.appendix}
    </div>
  `;
  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${template.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};

export const exportToMarkdown = (template: Template): string => {
  return `# ${template.title}

**Category:** ${template.category}

**Description:** ${template.description}

## Design Context
${template.designContext.replace(/<[^>]+>/g, '')}

## System Impacts
${template.systemImpacts.replace(/<[^>]+>/g, '')}

## Assumptions
${template.assumptions.replace(/<[^>]+>/g, '')}

## Out of Scope
${template.outOfScope.replace(/<[^>]+>/g, '')}

## Other Areas to Consider
${template.otherAreasToConsider.replace(/<[^>]+>/g, '')}

## Appendix
${template.appendix.replace(/<[^>]+>/g, '')}`;
};
