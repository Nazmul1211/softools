import os

def process(path):
    with open(path, 'r') as f:
        s = f.read()

    reps = {
        'border-zinc-200': 'border-border',
        'border-zinc-300': 'border-border',
        'border-zinc-700': 'border-border',
        'border-zinc-800': 'border-border',
        'bg-zinc-50': 'bg-muted/50',
        'bg-zinc-100': 'bg-muted',
        'bg-zinc-800': 'bg-muted',
        'bg-zinc-900': 'bg-muted/50',
        'bg-zinc-950': 'bg-background',
        'text-zinc-400': 'text-muted-foreground',
        'text-zinc-500': 'text-muted-foreground',
        'text-zinc-600': 'text-muted-foreground',
        'text-zinc-700': 'text-foreground',
        'text-zinc-900': 'text-foreground',
        
        'bg-blue-600': 'bg-primary',
        'bg-blue-100': 'bg-primary/10',
        'bg-blue-50': 'bg-primary/5',
        'bg-blue-900/50': 'bg-primary/20',
        'bg-blue-900': 'bg-primary/20',
        'bg-blue-950': 'bg-primary/20',
        
        'text-blue-600': 'text-primary',
        'text-blue-400': 'text-primary',
        'text-blue-300': 'text-primary/80',
        'text-blue-700': 'text-primary/80',
        
        'border-blue-200': 'border-primary/30',
        'border-blue-300': 'border-primary/50',
        'border-blue-500': 'border-primary',
        'border-blue-700': 'border-primary/50',
        'border-blue-900': 'border-primary/50',
        
        'focus:border-blue-500': 'focus:border-primary',
        'focus:ring-blue-500/20': 'focus:ring-primary/20',
        'ring-blue-500': 'ring-primary',
        'hover:border-blue-300': 'hover:border-primary/50',
        'hover:text-blue-600': 'hover:text-primary',
        'hover:text-blue-700': 'hover:text-primary/80',
        'dark:text-white': 'dark:text-foreground',
        'dark:text-zinc-400': 'dark:text-muted-foreground',
    }
    
    s = s.replace('dark:bg-zinc-900/50', 'dark:bg-muted/50')
    s = s.replace('from-blue-50 to-white', 'from-muted/50 to-background')
    s = s.replace('dark:from-zinc-900 dark:to-zinc-950', 'dark:from-muted/50 dark:to-background')
    
    for old, new in reps.items():
        s = s.replace(old, new)
        
    with open(path, 'w') as f:
        f.write(s)

for root, _, files in os.walk('.'):
    if './app' in root or './components' in root:
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                process(os.path.join(root, f))
