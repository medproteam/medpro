import { Activity, Github, Twitter, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary">
                <Activity className="w-4 h-4 text-white" />
                <span className="font-bold text-white">MEDPRO</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered healthcare companion on Camp Network blockchain
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://docs.campnetwork.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/campaign-layer/origin-sdk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Origin SDK
                </a>
              </li>
              <li>
                <a href="https://basecamp.cloud.blockscout.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Explorer
                </a>
              </li>
              <li>
                <a href="https://faucet.campnetwork.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Testnet Faucet
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 MEDPRO. Built on Camp Network. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://docs.campnetwork.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
