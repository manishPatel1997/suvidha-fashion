export default function AttachIcon({ width = 16, height = 16, color = "currentColor", ...props }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.5 3.5C11.5 2.11929 10.3807 1 9 1C7.61929 1 6.5 2.11929 6.5 3.5V10C6.5 11.3807 7.61929 12.5 9 12.5C10.3807 12.5 11.5 11.3807 11.5 10V4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4.5V10.5C4 13.2614 6.23858 15.5 9 15.5C11.7614 15.5 14 13.2614 14 10.5V3.5C14 0.738576 11.7614 -1.5 9 -1.5C6.23858 -1.5 4 0.738576 4 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}