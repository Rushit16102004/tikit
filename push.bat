@echo off
echo Pushing changes to GitHub and updating Render...
git add .
git commit -m "Auto update ticket app"
git push origin main
echo Done! Render will update automatically in 30 seconds.
pause
