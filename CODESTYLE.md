# Codestyle

## Functional components

Functional components must not declare the prop object's properties in its declaration. The first line of the function should assign each prop to its own variable, e.g.:
```tsx
function MyComponent(props: MyComponentProps) {
    const { style } = props;
}
```

Functional components should always have a type that is named after the component name, suffixed by `Props`, e.g.:

```tsx
function MyComponent(props: MyComponentProps) {

}
```

Unless the component accepts no props, and in such case, the props argument should be omitted, e.g.:

```tsx
function MyComponent() {

}
```

States and references must have a type, e.g.:
```tsx
function MyComponent() {
    const mapViewRef = useRef<MapView>();
    
    const [ bikes, setBikes ] = useState<Bike[] | null>(null);
}
```

