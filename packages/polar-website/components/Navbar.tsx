import React from "react";
import {Logo} from "icons/Logo";
import styled from "@emotion/styled";
import {flex} from "styles/flex";
import {Link} from "styled/Link";
import NextLink from "next/link";
import {ml, my} from "styles/margin";
import {Breakpoints, mq} from "styles/media-query";
import {Hamburger} from "icons/Hamburger";
import {Button} from "styled/Button";
import {px, py} from "styles/padding";
import {css} from "@emotion/react";

const NavbarLogo: React.FC = () => (
    <NextLink href="/">
        <Logo css={theme => css`
                font-size: 9.8rem;
                fill: ${theme.palette.text.normal.primary};
                cursor: pointer;
            `} />
    </NextLink>
);

const Container = styled('nav')`
    background: ${({ theme }) => theme.palette.background.default};
    ${flex({ align: 'center', justify: 'space-between' })};
    padding: ${({ theme }) => `${theme.spacing(2)}px ${theme.spacing(4)}px`};
    width: 100%;
`;

const LinksContainer = styled('div')`
    ${flex({ align: 'center' })}

    & > * + * {
        ${({ theme }) => ml(3.5)(theme)}
    }

    ${mq(Breakpoints.lg)} {
        display: none;
    }
`;

const HamburgerIcon = styled(Hamburger)`
    font-size: 1.85rem;
    display: none;
    cursor: pointer;

    ${mq(Breakpoints.lg)} {
        display: block;
    }
`;

const NavLink = styled(Link)`
    min-width: auto;
    padding-top: ${({ theme }) => theme.spacing(1.25)}px;
    padding-bottom: ${({ theme }) => theme.spacing(1.25)}px;
`;

interface IPhoneMenuContainerProps {
    readonly isOpen: boolean;
}

const PhoneMenuContainer = styled.div<IPhoneMenuContainerProps>`
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000;
    top: 0;
    right: -100%;
    display: none;
    background: rgba(255, 255, 255, 0.65);
    transition: transform 250ms ease-in-out;
    will-change: transform;
    flex-direction: column;
    justify-content: space-between;
    ${({ theme }) => py(3)(theme)}
    ${({ theme }) => px(3)(theme)}

    ${({ isOpen }) => isOpen ? 'transform: translateX(-100%);' : ''}
    backdrop-filter: blur(44px);

    & a {
        display: block;
    }

    ${mq(Breakpoints.lg)} {
        display: flex;
    }
`;

const PhoneLinksContainer = styled.div`
    ${({ theme }) => my(6)(theme)}
    ${flex({ dir: 'column' })}

    & button {
        text-align: left;
    }
`;

interface IPhoneMenuProps extends IPhoneMenuContainerProps {
    readonly onClose: () => void;
}


const PhoneMenu: React.FC<IPhoneMenuProps> = (props) => {
    const { isOpen, onClose } = props;

    return (
        <PhoneMenuContainer isOpen={isOpen}>
            <div>
                <div css={flex({ justify: 'space-between' })}>
                    <NavbarLogo />
                    <div role="button"
                         css={theme => css`
                            cursor: pointer;
                            font-size: 2rem;
                            align-self: flex-end;
                            color: ${theme.palette.text.normal.hint}
                        `}
                         onClick={onClose}>
                         ✕
                    </div>
                </div>
                <PhoneLinksContainer>
                    <NavLink href="https://getpolarized.io/blog/" variant="text">
                        Blog
                    </NavLink>
                    <NavLink href="https://getpolarized.io/docs/" variant="text">
                        Documentation
                    </NavLink>
                    <NavLink href="https://getpolarized.io/chrome-extension" variant="text">
                        Google Chrome Extension
                    </NavLink>
                </PhoneLinksContainer>
            </div>
            <div css={flex({ justify: 'center' })}>
                <NavLink href="https://app.getpolarized.io">Sign In</NavLink>
            </div>
        </PhoneMenuContainer>
    );
};

export const Navbar: React.FC = () => {
    const [isOpen, setOpen] = React.useState(false);

    const toggleOpen = React.useCallback(() => setOpen(open => ! open), [setOpen]);

    return (
        <>
            <PhoneMenu isOpen={isOpen} onClose={toggleOpen} />
            <Container>
                <NavbarLogo />
                <LinksContainer>
                    <NavLink href="https://getpolarized.io/blog/"
                             variant="text">
                        Blog
                    </NavLink>
                    <NavLink href="https://getpolarized.io/docs/"
                             variant="text">
                        Documentation
                    </NavLink>
                    <NavLink href="https://getpolarized.io/chrome-extension"
                          variant="link">
                        Google Chrome Extension
                    </NavLink>
                    <NavLink href="https://app.getpolarized.io/sign-in">Sign In</NavLink>
                </LinksContainer>
                <HamburgerIcon onClick={toggleOpen} />
            </Container>
        </>
    );
};
