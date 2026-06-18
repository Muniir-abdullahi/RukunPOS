<?php

$files = glob(__DIR__ . '/../app/Models/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    if (!str_contains($content, 'use Illuminate\Database\Eloquent\Factories\HasFactory;')) {
        $content = str_replace(
            "use Illuminate\Database\Eloquent\Model;",
            "use Illuminate\Database\Eloquent\Model;\nuse Illuminate\Database\Eloquent\Factories\HasFactory;",
            $content
        );
        
        $content = preg_replace(
            '/(class [a-zA-Z0-9_]+ extends [a-zA-Z0-9_]+\s*\{)/',
            "$1\n    use HasFactory;\n",
            $content
        );
        
        file_put_contents($file, $content);
        echo "Updated $file\n";
    }
}
