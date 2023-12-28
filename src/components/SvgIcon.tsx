const SvgIcon = ({
  name,
  ...props
}: {
  name: string;
  [props: string]: any;
}) => {
  try {
    const svgPath = `/assets/svg/${name}.svg`;
    return <img src={svgPath} alt={name} {...props} />;
  } catch (error) {
    console.error(`Error loading SVG: ${name}`);
    return null;
  }
};

export default SvgIcon;
