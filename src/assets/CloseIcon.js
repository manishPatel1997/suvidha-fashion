export default function CloseIcon({ width = 17, height = 17, color = "currentColor", ...props }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 17 17" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 1L16 16" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 1L1 16" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}