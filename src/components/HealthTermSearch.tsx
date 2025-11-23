import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function HealthTermSearch() {
  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!term.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-health-chat', {
        body: {
          messages: [
            {
              role: 'user',
              content:
                `Explain the health term "${term}" in clear, simple language for a non-medical person. ` +
                'Include: 1) definition, 2) common symptoms, 3) possible causes, 4) typical treatments or next steps. ' +
                'Finish with a short reminder that this is not medical advice and they should talk to a healthcare professional.',
            },
          ],
          useOpenAI: false,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.response) {
        setResult('No information available right now. Please try another term.');
      } else {
        setResult(data.response as string);
      }
    } catch (error: any) {
      console.error('Health term search error:', error);
      toast.error(error.message || 'Failed to fetch health information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-sm p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Health Term Search
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Type any health condition, symptom, or medical term to get a friendly explanation, common symptoms,
            and usual treatment options.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. hypertension, asthma, chest pain..."
            className="bg-background"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !term.trim()}
            className="min-w-[140px] bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className="mt-4 p-4 md:p-5 rounded-2xl bg-muted/60 border border-border/70 max-h-[420px] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </motion.div>
    </Card>
  );
}
