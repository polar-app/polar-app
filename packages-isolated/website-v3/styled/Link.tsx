import { default as NextLink, type LinkProps } from 'next/link';
import { Button, type Variant } from '../styled/Button';

interface IProps extends LinkProps {
    readonly variant?: Variant;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const Link: React.FC<IProps> = (props) => {
    const { children, variant, className, style, ...rest } = props;
    return (
        <NextLink {...rest} passHref>
            <a>
                <Button className={className} style={style} variant={variant} children={children} />
            </a>
        </NextLink>
    );
};
