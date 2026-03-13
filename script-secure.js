// Client-side security hardening (preserved from original)
(function() { 'use strict';
const SECURITY_CONFIG = { enableClickjackProtection:true,enableXSSProtection:true,enableConsoleWarning:true,enableDevToolsDetection:true,enableContextMenuProtection:false,enableCopyProtection:false,logSecurityEvents:true };
function sanitizeHTML(str){const t=document.createElement('div');t.textContent=str;return t.innerHTML;}
function detectXSS(input){const p=[/<script[^>]*>.*?<\/script>/gi,/javascript:/gi,/on\w+\s*=/gi,/<iframe[^>]*>/gi,/<object[^>]*>/gi,/<embed[^>]*>/gi,/<img[^>]*onerror/gi,/eval\(/gi,/expression\(/gi,/vbscript:/gi,/data:text\/html/gi,/<svg[^>]*onload/gi];return p.some(x=>x.test(input));}
function sanitizeInput(input){if(typeof input!=='string')return input;let s=input.replace(/[<>"']/g,'');s=s.replace(/javascript:/gi,'');s=s.replace(/on\w+=/gi,'');return s;}
function detectClickjacking(){if(window.self!==window.top){if(SECURITY_CONFIG.enableClickjackProtection){window.top.location=window.self.location;return true;}}return false;}
function displayConsoleWarning(){if(!SECURITY_CONFIG.enableConsoleWarning)return;console.log('%c⚠️ SECURITY WARNING ⚠️','color:#FF3E3E;font-size:20px;font-weight:bold;');console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is likely a scam.','color:#66FCF1;font-size:14px;');}
function enforceHTTPS(){if(window.location.protocol==='http:'&&window.location.hostname!=='localhost'&&window.location.hostname!=='127.0.0.1'){window.location.href='https://'+window.location.hostname+window.location.pathname+window.location.search;}}
function clearSessionData(){window.addEventListener('beforeunload',function(){sessionStorage.clear();});}
function logSecurityEvent(t,d){if(!SECURITY_CONFIG.logSecurityEvents)return;console.warn('[SECURITY EVENT]',{type:t,details:d,url:window.location.href,timestamp:new Date().toISOString()});}
function initSecurity(){enforceHTTPS();detectClickjacking();displayConsoleWarning();clearSessionData();logSecurityEvent('SECURITY_INITIALIZED',{timestamp:new Date().toISOString()});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSecurity);}else{initSecurity();}
window.PortfolioSecurity={sanitizeHTML,sanitizeInput,detectXSS,logSecurityEvent};
})();
